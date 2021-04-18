const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel(errorMessage, data) {
  return {
    backLink: '/abstraction-licence',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'sSSI',
      name: 'sSSI',
      fieldset: {
        legend: {
          text: 'Does the project directly impact a Site of Special Scientific Interest?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/SSSI',
    handler: (request, h) => {
      const sSSI = request.yar.get('sSSI')
      const data = sSSI || null
      return h.view('SSSI', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/SSSI',
    options: {
      validate: {
        payload: Joi.object({
          sSSI: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('SSSI', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('sSSI', request.payload.sSSI)
        return h.redirect('./project-details')
      }
    }
  }
]
