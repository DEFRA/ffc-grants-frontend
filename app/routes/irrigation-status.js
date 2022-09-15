const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'irrigation-status'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigated-crops`
const nextPath = `${urlPrefix}/irrigated-land`

const values = { valueOne: 'Yes', valueTwo: 'No' }
const prefixModelParams = [
  previousPath, currentPath, values, 'currentlyIrrigating', 'Are you currently irrigating?'
]
const hint = {
  text: 'The location of the project'
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: async (request, h) => {
      const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

      if (getYarValue(request, 'current-score')) {
        return h.redirect(`${urlPrefix}/irrigated-crops`)
      }

      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, null, currentlyIrrigating, hint))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          currentlyIrrigating: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorList = []

          errorList.push({ text: getErrorMessage(errorObject), href: '#currentlyIrrigating' })
          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, errorList, null, hint)).takeover()
        }
      },
      handler: async (request, h) => {
        const { currentlyIrrigating } = request.payload
        setYarValue(request, 'currentlyIrrigating', currentlyIrrigating)
        return h.redirect(nextPath)
      }
    }
  }
]
