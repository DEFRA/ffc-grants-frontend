const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'SSSI'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/remaining-costs`
const nextPath = `${urlPrefix}/abstraction-licence`

const values = { valueOne: 'Yes', valueTwo: 'No' }
const prefixModelParams = [
  previousPath, currentPath, values, 'sSSI',
  'Does the project directly impact a Site of Special Scientific Interest?'
]

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const sSSI = getYarValue(request, 'sSSI')
      const data = sSSI || null
      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          sSSI: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'sSSI', request.payload.sSSI)
        await gapiService.sendJourneyTime(request, gapiService.metrics.ELIGIBILITY)
        return h.redirect(nextPath)
      }
    }
  }
]
