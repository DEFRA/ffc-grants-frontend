const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'tenancy'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/project-start`
const nextPath = `${urlPrefix}/project-items`
const tenancyLengthPath = `${urlPrefix}/tenancy-length`

const values = { valueOne: 'Yes', valueTwo: 'No' }
const prefixModelParams = [
  previousPath, currentPath, values, 'landOwnership',
  'Is the planned project on land the farm business owns?'
]

const hint = {
  text: 'The location of the project'
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const landOwnership = getYarValue(request, 'landOwnership')
      const data = landOwnership || null
      
      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, null, data, hint))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          landOwnership: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          const errorList = []

          errorList.push({ text: getErrorMessage(errorObject), href: '#landOwnership' })
          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, errorList, null, hint)).takeover()
        }
      },
      handler: (request, h) => {
        setYarValue(request, 'landOwnership', request.payload.landOwnership)
        return request.payload.landOwnership === 'Yes'
          ? h.redirect(nextPath)
          : h.redirect(tenancyLengthPath)
      }
    }
  }
]
