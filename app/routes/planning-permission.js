const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel(errorMessage, data) {
  return {
    backLink: '/remaining-costs',
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
      items: setLabelData(data, ['Not needed', 'Secured', 'Expected to have by 31st December 2021','Won\'t have by 31st December 2021']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
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
        request.yar.set('planningPermission', request.payload.planningPermission)
        return h.redirect('./project-details')
      }
    }
  }
]
