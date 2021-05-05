const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: './tenancy',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'tenancyLength',
      name: 'tenancyLength',
      fieldset: {
        legend: {
          text: 'Is the planned project on land with a tenancy agreement in place until 2026 or after?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelTenancyCondition () {
  return {
    backLink: './tenancy-length',
    messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/tenancy-length',
    handler: (request, h) => {
      const tenancyLength = request.yar.get('tenancyLength')
      const data = tenancyLength || null
      return h.view('tenancy-length', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/tenancy-length',
    options: {
      validate: {
        payload: Joi.object({
          tenancyLength: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('tenancy-length', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('tenancyLength', request.payload.tenancyLength)
        return request.payload.tenancyLength === 'Yes'
          ? h.redirect('./project-items')
          : h.view('./tenancy-length-condition', createModelTenancyCondition())
      }
    }
  }
]
