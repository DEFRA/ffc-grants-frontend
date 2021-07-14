const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'irrigation-water-source'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigated-land`
const nextPath = `${urlPrefix}/irrigation-systems`
const scorePath = `${urlPrefix}/score`

function createModel (currentlyIrrigating, errorMessage, errorSummary, currentData, plannedData, hasScore) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore,
    currentlyIrrigating: (currentlyIrrigating === 'Yes' || currentlyIrrigating === 'yes'),
    pageTitle: (currentlyIrrigating === 'Yes' || currentlyIrrigating === 'yes'
      ? 'Will your water source change?'
      : 'Where will the irrigation water come from?'
    ),
    ...errorSummary ? { errorList: errorSummary } : {},

    mockCheckbox: {
      id: 'waterSourceCurrent',
      name: 'waterSourceCurrent',
      value: 'Not currently irrigating',
      type: 'hidden'
    },

    waterSourceCurrent: {
      idPrefix: 'waterSourceCurrent',
      name: 'waterSourceCurrent',
      fieldset: {
        legend: {
          text: 'Where does your current irrigation water come from?'
        }
      },
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(currentData, ['Peak-flow/winter abstraction', 'Bore hole/aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    },
    waterSourcePlanned: {
      idPrefix: 'waterSourcePlanned',
      name: 'waterSourcePlanned',
      fieldset: {
        legend: {
          text: 'Where will the irrigation water come from?'
        }
      },
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(plannedData, ['Peak-flow/winter abstraction', 'Bore hole/aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: 'Select one or two options to describe your irrigation water will come from' } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const currentData = getYarValue(request, 'waterSourceCurrent') || null
      const plannedData = getYarValue(request, 'waterSourcePlanned') || null

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
          waterSourceCurrent: Joi.any().required(),
          waterSourcePlanned: Joi.any().required(),
          results: Joi.any()

        }),
        failAction: (request, h, err) => {
          let { waterSourceCurrent, waterSourcePlanned } = request.payload
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)

          waterSourceCurrent = waterSourceCurrent ? [waterSourceCurrent].flat() : waterSourceCurrent
          waterSourcePlanned = waterSourcePlanned ? [waterSourcePlanned].flat() : waterSourcePlanned

          const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null
          return h.view(viewTemplate, createModel(currentlyIrrigating, errorMessage, null, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const errorList = []
        let { waterSourceCurrent, waterSourcePlanned, results } = request.payload

        waterSourceCurrent = [waterSourceCurrent].flat()
        waterSourcePlanned = [waterSourcePlanned].flat()
        const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

        if (waterSourceCurrent.length > 2 || waterSourcePlanned.length > 2) {
          if (waterSourceCurrent.length > 2) {
            errorList.push({ text: 'Select where your current irrigation water comes from', href: '#waterSourceCurrent' })
          }
          if (waterSourcePlanned.length > 2) {
            errorList.push({ text: 'Select where your irrigation water will come from', href: '#waterSourcePlanned' })
          }
          return h.view(viewTemplate, createModel(currentlyIrrigating, 'Select one or two options to describe project water source', errorList, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score')))
        }

        setYarValue(request, 'waterSourceCurrent', waterSourceCurrent)
        setYarValue(request, 'waterSourcePlanned', waterSourcePlanned)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
