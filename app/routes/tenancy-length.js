const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

function createModel (errorMessage, data) {
  return {
    backLink: `${urlPrefix}/tenancy`,
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
  backLink: `${urlPrefix}/tenancy-length`,
  nextLink: `${urlPrefix}/project-items`,
  messageHeader: 'You may be able to apply for a grant from this scheme',
  messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
}

module.exports = [
  {
    method: 'GET',
    path: `${urlPrefix}/tenancy-length`,
    handler: (request, h) => {
      const tenancyLength = request.yar.get('tenancyLength')
      const data = tenancyLength || null
      return h.view('tenancy-length', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: `${urlPrefix}/tenancy-length`,
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
          ? h.redirect(`${urlPrefix}/project-items`)
          : h.view('maybe-eligible', MAYBE_ELIGIBLE)
      }
    }
  }
]
