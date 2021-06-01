const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')

const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')

function createModel (backLink, errorMessage, data) {
  return {
    backLink,
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
        [LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE]
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
      const abstractionLicence = getYarValue(request, 'abstractionLicence')
      const data = abstractionLicence || null
      return h.view('abstraction-licence', createModel('./SSSI', null, data))
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
          return h.view('abstraction-licence', createModel('./SSSI', errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        const { abstractionLicence } = request.payload
        setYarValue(request, 'abstractionLicence', abstractionLicence)

        if (
          abstractionLicence === LICENSE_EXPECTED ||
          abstractionLicence === LICENSE_WILL_NOT_HAVE
        ) {
          return h.redirect('./abstraction-caveat')
        }
        return h.redirect('./project-details')
      }
    }
  }
]
