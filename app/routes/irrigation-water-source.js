const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')

function createModel (errorMessage, errorSummary, currentData, plannedData) {
  return {
    backLink: '/irrigated-land',
    ...(errorSummary ? { errorText: errorSummary } : {}),
    waterSourceCurrent: {
      idPrefix: 'waterSourceCurrent',
      name: 'waterSourceCurrent',
      fieldset: {
        legend: {
          text: 'Where does your current irrigation water come from?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(currentData, ['Peak flow surface water', 'Bore hole / aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains', 'Not currently irrigating']),
      ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    },
    waterSourcePlanned: {
      idPrefix: 'waterSourcePlanned',
      name: 'waterSourcePlanned',
      fieldset: {
        legend: {
          text: 'Where will the irrigation water come from?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(plannedData, ['Peak flow surface water', 'Bore hole / aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/irrigation-water-source',
    handler: (request, h) => {
      const waterSourceCurrent = request.yar.get('waterSourceCurrent')
      const waterSourcePlanned = request.yar.get('waterSourcePlanned')
      const currentData = waterSourceCurrent || null
      const plannedData = waterSourcePlanned || null
      return h.view('irrigation-water-source', createModel(null, null, currentData, plannedData))
    }
  },
  {
    method: 'POST',
    path: '/irrigation-water-source',
    options: {
      validate: {
        payload: Joi.object({
          waterSourceCurrent: Joi.any().required(),
          waterSourcePlanned: Joi.any().required()
        }),
        failAction: (request, h) => {
          const { waterSourceCurrent, waterSourcePlanned } = request.payload
          return h.view('irrigation-water-source', createModel('Please select an option', null, waterSourceCurrent, waterSourcePlanned)).takeover()
        }
      },
      handler: (request, h) => {
        let waterSourceCurrent = []
        let waterSourcePlanned = []

        if (typeof request.payload.waterSourceCurrent === 'string') {
          waterSourceCurrent.push(request.payload.waterSourceCurrent)
        } else waterSourceCurrent = request.payload.waterSourceCurrent

        if (typeof request.payload.waterSourcePlanned === 'string') {
          waterSourcePlanned.push(request.payload.waterSourcePlanned)
        } else waterSourcePlanned = request.payload.waterSourcePlanned

        if (waterSourceCurrent.length > 2 || waterSourcePlanned.length > 2) {
          return h.view('irrigation-water-source', createModel('Only one or two selections are allowed', 'Only one or two selections are allowed', waterSourceCurrent, waterSourcePlanned))
            .takeover()
        }

        request.yar.set('waterSourceCurrent', request.payload.waterSourceCurrent)
        request.yar.set('waterSourcePlanned', request.payload.waterSourcePlanned)
        return h.redirect('./irrigation-systems')
      }
    }
  }
]
