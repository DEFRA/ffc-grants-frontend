const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'applying'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/business-details`
const nextPathAgent = `${urlPrefix}/agent-details`
const nextPathFarmer = `${urlPrefix}/farmer-details`

function createModel (errorMessage, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
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
    path: currentPath,
    handler: (request, h) => {
      const applying = getYarValue(request, 'applying')
      const data = applying || null
      return h.view(viewTemplate, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          applying: Joi.string().required()
        }),
        failAction: (request, h) => {
          gapiService.sendDimensionOrMetric(request, { dimensionOrMetric: gapiService.dimensions.VALIDATION, value: true })
          return h.view(viewTemplate, createModel('Select who is applying for this grant', null)).takeover()
        }
      },
      handler: async (request, h) => {
        const { applying } = request.payload
        setYarValue(request, 'applying', applying)

        await gapiService.sendDimensionOrMetric(request, {
          dimensionOrMetric: gapiService.dimensions.AGENTFORMER,
          value: applying
        })
        if (applying === 'Agent') {
          return h.redirect(nextPathAgent)
        } else {
          setYarValue(request, 'agentDetails', null)
        }
        return h.redirect(nextPathFarmer)
      }
    }
  }
]
