const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'tenancy-length'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/tenancy`
const nextPath = `${urlPrefix}/project-items`

function createModel (errorMessage, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'tenancyLength',
      name: 'tenancyLength',
      fieldset: {
        legend: {
          text: 'Do you have a tenancy agreement until 2026 or after?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

const MAYBE_ELIGIBLE = {
  backLink: currentPath,
  nextLink: nextPath,
  messageHeader: 'You may be able to apply for a grant from this scheme',
  messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const tenancyLength = request.yar.get('tenancyLength')
      const data = tenancyLength || null
      return h.view(viewTemplate, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          tenancyLength: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('tenancyLength', request.payload.tenancyLength)
        return request.payload.tenancyLength === 'Yes'
          ? h.redirect(nextPath)
          : h.view('maybe-eligible', MAYBE_ELIGIBLE)
      }
    }
  }
]
