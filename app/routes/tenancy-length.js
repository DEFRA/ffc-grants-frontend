const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: '/tenancy',
    radios: {
      classes: '',
      idPrefix: 'landOwnership',
      name: 'landOwnership',
      fieldset: {
        legend: {
          text: 'Page created only for URL redirection. < Please add the page contents :)',
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
    path: '/tenancy-length',
    handler: (request, h) => {
      const PLEASE_CHANGE = request.yar.get('PLEASE_CHANGE')
      const data = PLEASE_CHANGE || null
      return h.view('/tenancy-length', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/tenancy-length',
    options: {
      validate: {
        payload: Joi.object({
          landOwnership: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('/tenancy-length', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('PLEASE_CHANGE', request.payload.PLEASE_CHANGE)
        return request.payload.landOwnership === 'Yes'
          ? h.redirect('./PLEASE_CHANGE_A')
          : h.redirect('./PLEASE_CHANGE_B')
      }
    }
  }
]
