const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage, getGrantValues } = require('../helpers/helper-functions')
const { MIN_GRANT, MAX_GRANT } = require('../helpers/grant-details')
const { PROJECT_COST_REGEX } = require('../helpers/regex-validation')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'project-cost'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/project-items`
const nextPath = `${urlPrefix}/potential-amount`

function createModel(errorList, projectCost, projectItemsList) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},
    inputProjectCost: {
      id: 'projectCost',
      name: 'projectCost',
      classes: 'govuk-input--width-10',
      prefix: {
        text: '£'
      },
      label: {
        text: 'What is the total estimated cost of the items?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        html:
          `
          <p>You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £35,000 (40% of £87,500). The maximum grant is £500,000.<p/>
          <p>Do not include VAT.<p/>
          <p>Enter amount, for example 95,000<p/>
          `
      },
      value: projectCost,
      ...(errorList ? { errorMessage: { text: errorList[ 0 ].text } } : {})
    },
    projectItemsList
  }
}

function createModelNotEligible() {
  return {
    refTitle: 'What is the estimated cost of the items?',
    backLink: currentPath,
    messageContent: 'You can only apply for a grant of up to 40% of the estimated costs. ',
    insetText: 
      { text: 'The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £500,000.' },
    messageLink: {
      url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
      title: 'See other grants you may be eligible for.'
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const projectCost = getYarValue(request, 'projectCost') || null
      const projectItemsList = getYarValue(request, 'projectItemsList')

      return h.view(viewTemplate, createModel(null, projectCost, projectItemsList))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          projectCost: Joi.string().regex(PROJECT_COST_REGEX).max(7).required()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          const projectItemsList = getYarValue(request, 'projectItemsList') || null
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#projectCost' })
          return h.view(viewTemplate, createModel(errorList, null, projectItemsList)).takeover()
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
          return h.view('not-eligible', createModelNotEligible())
        }
        return h.redirect(nextPath)
      }
    }
  }
]
