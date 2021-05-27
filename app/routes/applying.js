const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, data) {
  return {
    backLink: './business-details',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'applying',
      name: 'applying',
      fieldset: {
        legend: {
          text: 'Who is applying for this grant?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Farmer', 'Agent']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/applying',
    handler: (request, h) => {
      const applying = getYarValue(request, 'applying')
      const data = applying || null
      return h.view('applying', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/applying',
    options: {
      validate: {
        payload: Joi.object({
          applying: Joi.string().required()
        }),
        failAction: (request, h) =>
          h
            .view('applying', createModel('Select who is applying for this grant', null))
            .takeover()
      },
      handler: async (request, h) => {
        const { applying } = request.payload
        setYarValue(request, 'applying', applying)

        await gapiService.sendDimensionOrMetric(request, {
          dimensionOrMetric: gapiService.dimensions.AGENTFORMER,
          value: applying
        })
        if (applying === 'Agent') {
          return h.redirect('./agent-details')
        }
        return h.redirect('./farmer-details')
      }
    }
  }
]
