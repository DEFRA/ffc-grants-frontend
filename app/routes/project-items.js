const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')

function createModel (errorMessage, errorSummary, backLink, projectInfrastucture, projectEquipment, projectTechnology) {
  return {
    backLink,
    ...(errorSummary ? { errorText: errorSummary } : {}),
    checkboxesInfrastucture: {
      idPrefix: 'projectInfrastucture',
      name: 'projectInfrastucture',
      fieldset: {
        legend: {
          text: 'Reservoir construction and infrastructure',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(
        projectInfrastucture,
        ['Construction of dam walls',
          'Construction of reservoir',
          'Overflow/spillway',
          'Synthetic liner',
          'Abstraction point including pump',
          'Engineer fees (construction engineers only)',
          'Fencing for synthetically lined reservoir',
          'Filtration equipment',
          'Irrigation pump(s) and controls',
          'Pipework to fill the reservoir',
          'Pumphouse',
          'Underground water distribution main and hydrants',
          'Electricity installation for pump house',
          'Water meter'
        ]
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    checkboxesEquipment: {
      idPrefix: 'projectEquipment',
      name: 'projectEquipment',
      fieldset: {
        legend: {
          text: 'Irrigation equipment',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(
        projectEquipment,
        ['Boom',
          'Trickle',
          'Ebb and flood or capillary bed',
          'Sprinklers and mist'
        ]
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    checkboxesTechnology: {
      idPrefix: 'projectTechnology',
      name: 'projectTechnology',
      fieldset: {
        legend: {
          text: 'Technology',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(
        projectTechnology,
        ['Software to monitor soil moisture levels and schedule irrigation',
          'Software and sensors to optimise water application'
        ]
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/project-items',
    handler: (request, h) => {
      const landOwnership = request.yar.get('landOwnership') || null
      const backUrl = landOwnership === 'No' ? '/answers' : '/tenancy'

      const projectInfrastucture = request.yar.get('projectInfrastucture') || null
      const projectEquipment = request.yar.get('projectEquipment') || null
      const projectTechnology = request.yar.get('projectTechnology') || null

      return h.view(
        'project-items',
        createModel(null, null, backUrl, projectInfrastucture, projectEquipment, projectTechnology)
      )
    }
  },
  {
    method: 'POST',
    path: '/project-items',
    options: {
      validate: {
        payload: Joi.object({
          projectInfrastucture: Joi.any(),
          projectEquipment: Joi.any(),
          projectTechnology: Joi.any()
        }),
        failAction: (request, h) => {
          const landOwnership = request.yar.get('landOwnership') || null
          const backUrl = landOwnership === 'No' ? '/answers' : '/tenancy'
          return h.view('project-items', createModel('Please select an option', null, backUrl, null)).takeover()
        }
      },
      handler: (request, h) => {
        const landOwnership = request.yar.get('landOwnership') || null
        const backUrl = landOwnership === 'No' ? '/answers' : '/tenancy'

        let {
          projectInfrastucture,
          projectEquipment,
          projectTechnology
        } = request.payload

        if (!projectInfrastucture && !projectEquipment && !projectTechnology) {
          return h.view(
            'project-items',
            createModel(
              'Select all the items your project needs',
              null,
              backUrl,
              projectInfrastucture,
              projectEquipment,
              projectTechnology
            )
          ).takeover()
        }

        projectInfrastucture = [projectInfrastucture].flat()
        projectEquipment = [projectEquipment].flat()
        projectTechnology = [projectTechnology].flat()

        request.yar.set('projectInfrastucture', projectInfrastucture)
        request.yar.set('projectEquipment', projectEquipment)
        request.yar.set('projectTechnology', projectTechnology)
        return h.redirect('./project-details')
      }
    }
  }
]
