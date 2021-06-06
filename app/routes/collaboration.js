const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

const pageDetails = require('../helpers/page-details')('Q20')
// console.log(pageDetails)

function createModel (errorMessage, data) {
  return {
    backLink: pageDetails.previousPath,
    formActionPage: pageDetails.path,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'collaboration',
      name: 'collaboration',
      fieldset: {
        legend: {
          text: 'Will water be supplied to other farms?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text:
          'If you intend to supply water via a water sharing agreement as a result of this project.'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: pageDetails.path,
    handler: (request, h) => {
      const collaboration = getYarValue(request, 'collaboration')
      const data = collaboration || null
      return h.view(pageDetails.template, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          collaboration: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(pageDetails.template, createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        setYarValue(request, 'collaboration', request.payload.collaboration)
        return h.redirect(`${pageDetails.pathPrefix}/score`)
      }
    }
  }
]
