const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { createModelTwoRadiosApplying } = require('../helpers/modelTwoRadios')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'applying'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/business-details`
const nextPathAgent = `${urlPrefix}/agent-details`
const nextPathFarmer = `${urlPrefix}/farmer-details`

const values = { valueOne: 'Applicant', valueTwo: 'Agent' }
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
      return h.view(viewTemplate, createModelTwoRadiosApplying(...prefixModelParams, null, data))
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
        failAction: async (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorList = []
          errorList.push({ text: getErrorMessage(errorObject), href: '#applying' })
          return h.view(viewTemplate, createModelTwoRadiosApplying(...prefixModelParams, errorList, null)).takeover()
        }
      },
      handler: async (request, h) => {
        const { applying } = request.payload
        setYarValue(request, 'applying', applying)
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
