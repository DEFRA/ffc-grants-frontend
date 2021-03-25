const Joi = require('joi')

function createModel (errorMessage, projectCost, projectItems) {
  return {
    backLink: '/project-cost',
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
      inputmode: 'numeric',
      pattern: '[0-9]*',
      value: projectCost
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
          projectCost: Joi.number().required()
        }),
        failAction: (request, h) => {
          const projectInfrastucture = request.yar.get('projectInfrastucture') || {}
          const projectEquipment = request.yar.get('projectEquipment') || {}
          const projectTechnology = request.yar.get('projectTechnology') || {}

          const projectItems = [...projectInfrastucture, ...projectEquipment, ...projectTechnology]
          return h.view('project-cost', createModel('222222----Please select an option', null, projectItems)).takeover()
        }
      },
      handler: (request, h) => {
        const { projectCost } = request.payload

        /*
        if (!projectInfrastucture && !projectEquipment && !projectTechnology) {
          return h.view(
            'project-cost',
            createModel(
              '------Select all the items your project needs',
              projectInfrastucture,
              projectEquipment,
              projectTechnology
            )
          ).takeover()
        }
        */

        request.yar.set('projectCost', projectCost)
        return h.redirect('./project-details')
      }
    }
  }
]
