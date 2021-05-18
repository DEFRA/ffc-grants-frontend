const Joi = require('joi')
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
        ['Not needed', 'Secured', 'Expected to have by 31 December 2021', 'Will not have by 31 December 2021']
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
      const planningPermission = request.yar.get('planningPermission')
      const backLink = (planningPermission === LICENSE_EXPECTED)
        ? './planning-caveat'
        : './planning-permission'

      const abstractionLicence = request.yar.get('abstractionLicence')
      const data = abstractionLicence || null
      return h.view('abstraction-licence', createModel(backLink, null, data))
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
          const planningPermission = request.yar.get('planningPermission')
          const backLink = (planningPermission === LICENSE_EXPECTED)
            ? './planning-caveat'
            : './planning-permission'

          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('abstraction-licence', createModel(backLink, errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('abstractionLicence', request.payload.abstractionLicence)
        return h.redirect('./SSSI')
      }
    }
  }
]
