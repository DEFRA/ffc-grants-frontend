const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'applying'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/business-details`
const nextPathAgent = `${urlPrefix}/agent-details`
const nextPathFarmer = `${urlPrefix}/applicant-details`

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
      const extraDetails = { errorList: null, data }
      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, extraDetails))
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
          const extraDetails = { errorList, data: null }

          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, extraDetails)).takeover()
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
