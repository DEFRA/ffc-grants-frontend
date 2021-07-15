const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'irrigated-crops'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/project-summary`
const scorePath = `${urlPrefix}/score`

const createModel = (errorMessage, data, hasScore) => ({
  backLink: previousPath,
  formActionPage: currentPath,
  hasScore: hasScore,
  radios: {
    classes: '',
    idPrefix: 'irrigatedCrops',
    name: 'irrigatedCrops',
    fieldset: {
      legend: {
        text: 'What main crops will be irrigated?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(data, [
      { text: 'Field-scale crops (for example, potatoes, onions, carrots)', value: 'Field-scale crops' },
      { text: 'Protected cropping (for example, glasshouse or poly tunnel)', value: 'Protected cropping' },
      { text: 'Fruit (for example, top fruit, bush fruit)', value: 'Fruit' }
    ]),

    ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
  }

})

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const irrigatedCrops = getYarValue(request, 'irrigatedCrops')
      const data = irrigatedCrops || null
      return h.view(viewTemplate, createModel(null, data, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          irrigatedCrops: Joi.string().required(),
          score: Joi.any(),
          results: Joi.any()

        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage, null, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const results = request.payload.results
        const hasScore = request.payload.score
        const nextPath = hasScore ? `${urlPrefix}/irrigated-land` : `${urlPrefix}/irrigation-status`
        setYarValue(request, 'irrigatedCrops', request.payload.irrigatedCrops)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
