const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'tenancy'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/project-start`
const nextPath = `${urlPrefix}/project-items`
const tenancyLengthPath = `${urlPrefix}/tenancy-length`

const prefixModelParams = [
  previousPath, currentPath, 'Yes', 'No', 'landOwnership',
  'Is the planned project on land the farm business owns?'
]

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const landOwnership = getYarValue(request, 'landOwnership')
      const data = landOwnership || null
      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, null, data))
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
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, errorMessage)).takeover()
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
