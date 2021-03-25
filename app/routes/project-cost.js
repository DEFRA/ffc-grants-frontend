const Joi = require('joi')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { MIN_GRANT, MAX_GRANT } = require('../helpers/storedValues')

function createModel (errorMessage, projectCost, projectItems) {
  return {
    backLink: '/project-items',
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
        text: 'Do not include VAT.'
      },
      value: projectCost,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    projectItems
  }
}

function createModelNotEligible () {
  return {
    backLink: '/project-cost',
    messageContent:
    `You can only apply for a grant of up to 40% of the estimated costs.<br/><br/>
    The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £1 million.`
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/project-cost',
    handler: (request, h) => {
      const projectInfrastucture = (request.yar.get('projectInfrastucture') || []).filter((x) => !!x)
      const projectEquipment = (request.yar.get('projectEquipment') || []).filter((x) => !!x)
      const projectTechnology = (request.yar.get('projectTechnology') || []).filter((x) => !!x)

      const projectItems = [...projectInfrastucture, ...projectEquipment, ...projectTechnology]
      const projectCost = request.yar.get('projectCost') || null

      return h.view(
        'project-cost',
        createModel(null, projectCost, projectItems)
      )
    }
  },
  {
    method: 'POST',
    path: '/project-cost',
    options: {
      validate: {
        payload: Joi.object({
          projectCost: Joi.number().integer().max(9999999).required()
        }),
        failAction: (request, h, err) => {
          const projectInfrastucture = request.yar.get('projectInfrastucture') || {}
          const projectEquipment = request.yar.get('projectEquipment') || {}
          const projectTechnology = request.yar.get('projectTechnology') || {}

          const projectItems = [...projectInfrastucture, ...projectEquipment, ...projectTechnology]

          if (err._original.projectCost === '') {
            return h.view(
              'project-cost',
              createModel('Enter the estimated cost for the items', null, projectItems)
            ).takeover()
          }

          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('project-cost', createModel(errorMessage, null, projectItems)).takeover()
        }
      },
      handler: (request, h) => {
        const { projectCost } = request.payload
        const calculatedGrant = 0.4 * Number(projectCost)
        const remainingCost = 0.6 * Number(projectCost) // OR projectCost - calculatedGrant

        request.yar.set('projectCost', projectCost)
        request.yar.set('calculatedGrant', calculatedGrant)
        request.yar.set('remainingCost', remainingCost)

        if ((calculatedGrant < MIN_GRANT) || (calculatedGrant > MAX_GRANT)) {
          return h.view('./not-eligible', createModelNotEligible())
        }
        return h.redirect('./project-details')
      }
    }
  }
]
