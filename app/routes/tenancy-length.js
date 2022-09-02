const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'tenancy-length'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/tenancy`
const nextPath = `${urlPrefix}/project-items`

function createModel (errorList, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'tenancyLength',
      name: 'tenancyLength',
      fieldset: {
        legend: {
          text: 'Do you a tenancy agreement for 5 years after the final grant payment?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: 'The location of the project'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
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
          gapiService.sendValidationDimension(request)
          const errorList = []
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#tenancyLength' })
          return h.view(viewTemplate, createModel(errorList)).takeover()
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
