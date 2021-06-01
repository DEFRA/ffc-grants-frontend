const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')

function createModel (errorMessage, errorSummary, currentData, plannedData, hasScore) {
  return {
    backLink: './irrigation-water-source',
    hasScore: hasScore,
    ...errorSummary ? { errorList: errorSummary } : {},
    irrigationCurrent: {
      idPrefix: 'irrigationCurrent',
      name: 'irrigationCurrent',
      fieldset: {
        legend: {
          text: 'What systems are currently used to irrigate?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(currentData,
        ['Boom', 'Capillary bed', 'Ebb and flow', 'Mist', 'Rain gun', 'Sprinklers', 'Trickle', 'Not currently irrigating']),
      ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    },
    irrigationPlanned: {
      idPrefix: 'irrigationPlanned',
      name: 'irrigationPlanned',
      fieldset: {
        legend: {
          text: 'What systems will be used to irrigate?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(plannedData, ['Boom', 'Capillary bed', 'Ebb and flow', 'Mist', 'Rain gun', 'Sprinklers', 'Trickle']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/irrigation-systems',
    handler: (request, h) => {
      const currentData = getYarValue(request, 'irrigationCurrent') || null
      const plannedData = getYarValue(request, 'irrigationPlanned') || null
      return h.view('irrigation-systems', createModel(null, null, currentData, plannedData, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: '/irrigation-systems',
    options: {
      validate: {
        payload: Joi.object({
          irrigationCurrent: Joi.any().required(),
          irrigationPlanned: Joi.any().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          let { irrigationCurrent, irrigationPlanned } = request.payload
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)

          irrigationCurrent = irrigationCurrent ? [irrigationCurrent].flat() : irrigationCurrent
          irrigationPlanned = irrigationPlanned ? [irrigationPlanned].flat() : irrigationPlanned
          return h.view('irrigation-systems', createModel(errorMessage, null, irrigationCurrent, irrigationPlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { irrigationCurrent, irrigationPlanned, results } = request.payload
        const errorList = []
        irrigationCurrent = [irrigationCurrent].flat()
        irrigationPlanned = [irrigationPlanned].flat()

        if (irrigationCurrent.length > 2 || irrigationPlanned.length > 2) {
          if (irrigationCurrent.length > 2) {
            errorList.push({ text: 'Select the systems currently used to irrigate', href: '#irrigationCurrent' })
          }
          if (irrigationPlanned.length > 2) {
            errorList.push({ text: 'Select the systems that will be used to irrigate', href: '#irrigationPlanned' })
          }
          return h.view('irrigation-systems', createModel('Select one or two options', errorList, irrigationCurrent, irrigationPlanned, getYarValue(request, 'current-score')))
            .takeover()
        }

        setYarValue(request, 'irrigationCurrent', irrigationCurrent)
        setYarValue(request, 'irrigationPlanned', irrigationPlanned)
        return results ? h.redirect('./score') : h.redirect('./productivity')
      }
    }
  }
]
