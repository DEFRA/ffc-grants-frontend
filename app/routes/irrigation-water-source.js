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
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore,
    ...errorList ? { errorList } : {},

    currentlyIrrigating: (currentlyIrrigating === 'Yes'),
    pageTitle: 'Water source',
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
          html: '<h2>Where does your current irrigation water come from?</h2>'
        }
      },
      hint: {
        text: 'Select up to 2 options'
      },
      items: setLabelData(currentData, ['Peak-flow/winter abstraction', 'Bore hole/aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorList && errorList[0].href === '#waterSourceCurrent' ? { errorMessage: { text: errorList[0].text } } : {})
    },
    waterSourcePlanned: {
      idPrefix: 'waterSourcePlanned',
      name: 'waterSourcePlanned',
      fieldset: {
        legend: {
          html: '<h2>Where will the irrigation water come from?</h2>'
        }
      },
      hint: {
        text: 'Select up to 2 options'
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

      return h.view(viewTemplate, createModel(getYarValue(request, 'currentlyIrrigating'), null, currentData, plannedData, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          waterSourceCurrent: Joi.array().max(2).single().required(),
          waterSourcePlanned: Joi.array().max(2).single().required(),
          results: Joi.any()

        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          let { waterSourceCurrent, waterSourcePlanned } = request.payload
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

          return h.view(viewTemplate, createModel(getYarValue(request, 'currentlyIrrigating'), errorList, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { waterSourceCurrent, waterSourcePlanned, results } = request.payload

        waterSourceCurrent = [waterSourceCurrent].flat()
        waterSourcePlanned = [waterSourcePlanned].flat()

        setYarValue(request, 'waterSourceCurrent', waterSourceCurrent)
        setYarValue(request, 'waterSourcePlanned', waterSourcePlanned)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
