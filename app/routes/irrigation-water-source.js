const Joi = require('joi')
const { setLabelData, findErrorList } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'irrigation-water-source'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigated-land`
const nextPath = `${urlPrefix}/irrigation-systems`
const scorePath = `${urlPrefix}/score`

function createModel (currentlyIrrigating, errorList, currentData, plannedData, hasScore) {
  currentlyIrrigating = currentlyIrrigating.toLowerCase()
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore,
    ...errorList ? { errorList } : {},

    currentlyIrrigating: (currentlyIrrigating === 'yes'),
    pageTitle: (currentlyIrrigating === 'yes'
      ? 'Will your water source change?'
      : 'Where will the irrigation water come from?'
    ),

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
      ...(errorList && errorList[0].href === '#waterSourceCurrent' ? { errorMessage: { text: errorList[0].text } } : {})
    },
    waterSourcePlanned: {
      idPrefix: 'waterSourcePlanned',
      name: 'waterSourcePlanned',
      fieldset: {
        legend: {
          text: currentlyIrrigating === 'yes' ? 'Where will the irrigation water come from?' : ''
        }
      },
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(plannedData, ['Peak-flow/winter abstraction', 'Bore hole/aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorList && errorList[errorList.length - 1].href === '#waterSourcePlanned' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
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
      return h.view(viewTemplate, createModel(currentlyIrrigating, null, currentData, plannedData, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          waterSourceCurrent: Joi.any().required(),
          waterSourcePlanned: Joi.any().required(),
          results: Joi.any()

        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          let { waterSourceCurrent, waterSourcePlanned } = request.payload
          const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null
          const errorList = []
          const [
            waterSourceCurrentError, waterSourcePlannedError
          ] = findErrorList(err, ['waterSourceCurrent', 'waterSourcePlanned'])

          if (waterSourceCurrentError) {
            errorList.push({
              text: waterSourceCurrentError,
              href: '#waterSourceCurrent'
            })
          }

          if (waterSourcePlannedError) {
            errorList.push({
              text: waterSourcePlannedError,
              href: '#waterSourcePlanned'
            })
          }

          waterSourceCurrent = waterSourceCurrent ? [waterSourceCurrent].flat() : waterSourceCurrent
          waterSourcePlanned = waterSourcePlanned ? [waterSourcePlanned].flat() : waterSourcePlanned

          return h.view(viewTemplate, createModel(currentlyIrrigating, errorList, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score'))).takeover()
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
            errorList.push({ text: 'Select a maximum of two options where your current irrigation water comes from', href: '#waterSourceCurrent' })
          }
          if (waterSourcePlanned.length > 2) {
            errorList.push({ text: 'Select a maximum of two options where your current irrigation water will come from', href: '#waterSourcePlanned' })
          }
          return h.view(viewTemplate, createModel(currentlyIrrigating, errorList, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score')))
        }

        setYarValue(request, 'waterSourceCurrent', waterSourceCurrent)
        setYarValue(request, 'waterSourcePlanned', waterSourcePlanned)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
