const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage, getGrantValues } = require('../helpers/helper-functions')
const { MIN_GRANT, MAX_GRANT } = require('../helpers/grant-details')
const { PROJECT_COST_REGEX } = require('../helpers/regex-validation')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, projectCost, projectItemsList) {
  return {
    backLink: './project-items',
    inputProjectCost: {
      id: 'projectCost',
      name: 'projectCost',
      classes: 'govuk-input--width-10',
      prefix: {
        text: '£'
      },
      label: {
        text: 'What is the estimated cost of the items?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        html: `
          You can only apply for a grant of up to 40% of the estimated costs.
          <br/>Do not include VAT.
          <br/><br/><span class="govuk-label">Pounds</span>
          For example 95000`
      },
      value: projectCost,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    projectItemsList
  }
}

function createModelNotEligible () {
  return {
    backLink: './project-cost',
    messageContent:
      `You can only apply for a grant of up to <span class="govuk-!-font-weight-bold">40%</span> of the estimated costs.<br/><br/>
    The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £1 million.`
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/project-cost',
    handler: (request, h) => {
      const projectCost = getYarValue(request, 'projectCost') || null
      const projectItemsList = getYarValue(request, 'projectItemsList')

      return h.view(
        'project-cost',
        createModel(null, projectCost, projectItemsList)
      )
    }
  },
  {
    method: 'POST',
    path: '/project-cost',
    options: {
      validate: {
        payload: Joi.object({
          projectCost: Joi.string().regex(PROJECT_COST_REGEX).max(7).required()
        }),
        failAction: (request, h, err) => {
          const projectItemsList = getYarValue(request, 'projectItemsList') || null

          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('project-cost', createModel(errorMessage, null, projectItemsList)).takeover()
        }
      },
      handler: async (request, h) => {
        const { projectCost } = request.payload
        const { calculatedGrant, remainingCost } = getGrantValues(projectCost)
        setYarValue(request, 'projectCost', projectCost)
        setYarValue(request, 'calculatedGrant', calculatedGrant)
        setYarValue(request, 'remainingCost', remainingCost)

        await gapiService.sendEligibilityEvent(request, (calculatedGrant >= MIN_GRANT) && (calculatedGrant <= MAX_GRANT))
        if ((calculatedGrant < MIN_GRANT) || (calculatedGrant > MAX_GRANT)) {
          return h.view('./not-eligible', createModelNotEligible())
        }
        return h.redirect('./grant')
      }
    }
  }
]
