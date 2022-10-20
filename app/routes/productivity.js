const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'productivity'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigation-systems`
const nextPath = `${urlPrefix}/collaboration`
const scorePath = `${urlPrefix}/score`

function createModel (errorList, data, hasScore) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore: hasScore,
    ...errorList ? { errorList } : {},
    checkboxes: {
      idPrefix: 'productivity',
      name: 'productivity',
      fieldset: {
        legend: {
          text: 'How will the project improve productivity?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        html: 'Productivity is about how much is produced relative to inputs (for example, increased yield for the same inputs or the same yield with lower inputs).<br/><br/> Select up to 2 options'
      },
      items: setLabelData(data, ['Introduce or expand high-value crops', 'Introduce or expand protected crops', 'Increased yield per hectare', 'Improved quality', 'Maintain productivity']),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const productivity = getYarValue(request, 'productivity')
      const data = productivity || null
      return h.view(viewTemplate, createModel(null, data, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          productivity: Joi.any().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorList = []
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#productivity' })
          return h.view(viewTemplate, createModel(errorList, null, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const hasScore = getYarValue(request, 'current-score')
        const errorList = []
        let { productivity, results } = request.payload
        productivity = [productivity].flat()
        if (productivity.length > 2) {
          errorList.push({ text: getErrorMessage({ key: 'error.productivity.max' }), href: '#productivity' })
          return h.view(viewTemplate, createModel(errorList, productivity, hasScore))
        }
        setYarValue(request, 'productivity', productivity)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
