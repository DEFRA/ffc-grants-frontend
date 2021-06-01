const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')

function createModel (errorMessage, errorSummary, data, hasScore) {
  return {
    backLink: './irrigation-systems',
    hasScore: hasScore,
    ...(errorSummary ? { errorText: errorSummary } : {}),
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
        html: 'Productivity is about how much is produced relative to inputs (for example increased yield for the same inputs or the same yield with lower inputs).<br/><br/><br/> Select one or two options'
      },
      items: setLabelData(data, ['Introduce or expand high-value crops', 'Introduce or expand protected crops', 'Increased yield per hectare', 'Improved quality', 'Maintain productivity']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/productivity',
    handler: (request, h) => {
      const productivity = getYarValue(request, 'productivity')
      const data = productivity || null
      return h.view('productivity', createModel(null, null, data, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: '/productivity',
    options: {
      validate: {
        payload: Joi.object({
          productivity: Joi.any().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('productivity', createModel(errorMessage, null, null, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const hasScore = getYarValue(request, 'current-score')
        let { productivity, results } = request.payload
        productivity = [productivity].flat()
        if (productivity.length > 2) {
          return h.view('productivity', createModel('Select one or two options', 'Select how the project will improve productivity', productivity, hasScore)).takeover()
        }
        setYarValue(request, 'productivity', productivity)
        return results ? h.redirect('./score') : h.redirect('./collaboration')
      }
    }
  }
]
