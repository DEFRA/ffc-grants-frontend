const Joi = require('joi')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

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

module.exports = [
  {
    method: 'GET',
    path: '/project-cost',
    handler: (request, h) => {
      const projectInfrastucture = request.yar.get('projectInfrastucture') || []
      const projectEquipment = request.yar.get('projectEquipment') || []
      const projectTechnology = request.yar.get('projectTechnology') || []

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
        request.yar.set('projectCost', projectCost)
        return h.redirect('./project-details')
      }
    }
  }
]
