const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'applying'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/business-details`
const nextPathAgent = `${urlPrefix}/agent-details`
const nextPathFarmer = `${urlPrefix}/farmer-details`

const values = { valueOne: 'Farmer', valueTwo: 'Agent' }
const prefixModelParams = [
  previousPath, currentPath, values, 'applying', 'Who is applying for this grant?'
]

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const applying = getYarValue(request, 'applying')
      const data = applying || null
      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, null, data))
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
        failAction: async (request, h) => {
          await gapiService.sendValidationDimension(request)
          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, 'Select who is applying for this grant', null)).takeover()
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
