const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: '/tenancy',
    radios: {
      classes: '',
      idPrefix: 'landOwnership',
      name: 'landOwnership',
      fieldset: {
        legend: {
          text: 'Page created only for URL redirection. < Please add the page contents :)',
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
    path: '/tenancy-length',
    handler: (request, h) => {
      const landOwnership = request.yar.get('landOwnership')
      const data = landOwnership || null
      return h.view('tenancy', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/tenancy-length',
    options: {
      validate: {
        payload: Joi.object({
          landOwnership: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('tenancy', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('landOwnership', request.payload.landOwnership)
        return request.payload.landOwnership === 'Yes'
          ? h.redirect('./project-details')
          : h.redirect('./tenancy-length')
      }
    }
  }
]
