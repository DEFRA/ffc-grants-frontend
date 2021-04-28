const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: '/planning-permission',
    radios: {
      classes: '',
      idPrefix: 'abstractionLicence',
      name: 'abstractionLicence',
      fieldset: {
        legend: {
          text: 'Does the project need an abstraction licence or a variation of one?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(
        data,
        ['Not needed', 'Secured', 'Expected to have by 31 December 2021', 'Won\'t have by 31 December 2021']
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/abstraction-licence',
    handler: (request, h) => {
      const abstractionLicence = request.yar.get('abstractionLicence')
      const data = abstractionLicence || null
      return h.view('abstraction-licence', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/abstraction-licence',
    options: {
      validate: {
        payload: Joi.object({
          abstractionLicence: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('abstraction-licence', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('abstractionLicence', request.payload.abstractionLicence)
        return h.redirect('./SSSI')
      }
    }
  }
]
