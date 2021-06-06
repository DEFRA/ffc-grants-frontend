const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

const pageDetails = require('../helpers/page-details')('Q6')

function createModel (errorMessage, data) {
  return {
    backLink: pageDetails.previousPath,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'landOwnership',
      name: 'landOwnership',
      fieldset: {
        legend: {
          text: 'Is the planned project on land the farm business owns?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
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
      const landOwnership = getYarValue(request, 'landOwnership')
      const data = landOwnership || null
      return h.view(pageDetails.template, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          landOwnership: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(pageDetails.template, createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        setYarValue(request, 'landOwnership', request.payload.landOwnership)
        return request.payload.landOwnership === 'Yes'
          ? h.redirect(pageDetails.nextPath)
          : h.redirect(`${pageDetails.pathPrefix}/tenancy-length`)
      }
    }
  }
]
