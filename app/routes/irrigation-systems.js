const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'irrigation-systems'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigation-water-source`
const nextPath = `${urlPrefix}/productivity`
const scorePath = `${urlPrefix}/score`

function createModel (currentlyIrrigating, errorMessage, errorSummary, currentData, plannedData, hasScore) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore,
    currentlyIrrigating,
    pageTitle: currentlyIrrigating ? 'Will your irrigation system change?' : 'What systems will be used to irrigate?',

    mockCheckbox: {
      id: 'irrigationCurrent',
      name: 'irrigationCurrent',
      value: 'Not currently irrigating',
      type: 'hidden'
    },

    ...errorSummary ? { errorList: errorSummary } : {},
    irrigationCurrent: {
      idPrefix: 'irrigationCurrent',
      name: 'irrigationCurrent',
      hint: {
        html: '<span class="govuk-label">What systems are currently used to irrigate?</span>Select one or two options'
      },
      items: setLabelData(currentData,
        ['Boom', 'Capillary bed', 'Ebb and flow', 'Mist', 'Rain gun', 'Sprinklers', 'Trickle', 'Not currently irrigating']),
      ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    },
    irrigationPlanned: {
      idPrefix: 'irrigationPlanned',
      name: 'irrigationPlanned',
      hint: {
        html: `
          ${currentlyIrrigating ? '<span class="govuk-label">What systems will be used to irrigate?</span>' : ''}
          Select one or two options
        `
      },
      items: setLabelData(plannedData, ['Boom', 'Capillary bed', 'Ebb and flow', 'Mist', 'Rain gun', 'Sprinklers', 'Trickle']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const currentData = getYarValue(request, 'irrigationCurrent') || null
      const plannedData = getYarValue(request, 'irrigationPlanned') || null

      const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null
      return h.view(viewTemplate, createModel(currentlyIrrigating, null, null, currentData, plannedData, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
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

          const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null
          return h.view(viewTemplate, createModel(currentlyIrrigating, errorMessage, null, irrigationCurrent, irrigationPlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { irrigationCurrent, irrigationPlanned, results } = request.payload
        const errorList = []
        irrigationCurrent = [irrigationCurrent].flat()
        irrigationPlanned = [irrigationPlanned].flat()
        const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

        if (irrigationCurrent.length > 2 || irrigationPlanned.length > 2) {
          if (irrigationCurrent.length > 2) {
            errorList.push({ text: 'Select the systems currently used to irrigate', href: '#irrigationCurrent' })
          }
          if (irrigationPlanned.length > 2) {
            errorList.push({ text: 'Select the systems that will be used to irrigate', href: '#irrigationPlanned' })
          }
          return h.view(
            viewTemplate,
            createModel(currentlyIrrigating, 'Select one or two options', errorList, irrigationCurrent, irrigationPlanned, getYarValue(request, 'current-score'))
          )
        }

        setYarValue(request, 'irrigationCurrent', irrigationCurrent)
        setYarValue(request, 'irrigationPlanned', irrigationPlanned)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
