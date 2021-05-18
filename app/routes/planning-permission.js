const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')

function createModel (errorMessage, data) {
  return {
    backLink: './remaining-costs',
    radios: {
      idPrefix: 'planningPermission',
      name: 'planningPermission',
      fieldset: {
        legend: {
          text: 'Does the project need planning permission?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, [LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE]),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

const NOT_ELIGIBLE = {
  backLink: './planning-permission',
  messageContent: 'Any planning permission must be in place by 31 December 2021 (the end of the application window).'
}

module.exports = [
  {
    method: 'GET',
    path: '/planning-permission',
    handler: (request, h) => {
      const planningPermission = request.yar.get('planningPermission') || null
      return h.view('planning-permission', createModel(null, planningPermission))
    }
  },
  {
    method: 'POST',
    path: '/planning-permission',
    options: {
      validate: {
        payload: Joi.object({
          planningPermission: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('planning-permission', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        const { planningPermission } = request.payload
        request.yar.set('planningPermission', planningPermission)

        return (planningPermission === LICENSE_WILL_NOT_HAVE)
          ? h.view('not-eligible', NOT_ELIGIBLE)
          : h.redirect('./abstraction-licence')
      }
    }
  }
]
