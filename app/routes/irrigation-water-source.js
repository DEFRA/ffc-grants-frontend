const Joi = require('joi')
const { setLabelData, findErrorList, getCurrentWaterSourceOptions, getPlannedWaterSourceOptions } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')
const { guardPage } = require('../helpers/page-guard')
const { startPageUrl } = require('../config/server')

const viewTemplate = 'irrigation-water-source'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/mains`
const nextPath = `${urlPrefix}/irrigation-systems`
const scorePath = `${urlPrefix}/score`

function createModel(currentlyIrrigating, errorList, currentData, plannedData, hasScore, mains) {
  return {
    backLink: previousPath,
    preValidationKeys: ['mains'],
    formActionPage: currentPath,
    hasScore,
    ...errorList ? { errorList } : {},

    currentlyIrrigating: (currentlyIrrigating === 'Yes'),
    pageTitle: (currentlyIrrigating === 'Yes'
      ? 'Water source'
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
          html: '<h2 class="govuk-heading-m">Where does your current irrigation water come from?</h2>'
        }
      },
      hint: {
        text: 'Select up to 2 options'
      },
      items: setLabelData(currentData, getCurrentWaterSourceOptions(mains)),
      ...(errorList && errorList[0].href === '#waterSourceCurrent' ? { errorMessage: { text: errorList[0].text } } : {})
    },
    waterSourcePlanned: {
      idPrefix: 'waterSourcePlanned',
      name: 'waterSourcePlanned',
      fieldset: {
        legend: {
          html: currentlyIrrigating === 'Yes' ? '<h2 class="govuk-heading-m">Where will the irrigation water come from?</h2>' : ''
        }
      },
      hint: {
        text: 'Select up to 2 options'
      },
      items: setLabelData(plannedData, getPlannedWaterSourceOptions(mains)),
      ...(errorList && errorList[errorList.length - 1].href === '#waterSourcePlanned' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const isRedirect = guardPage(request, ['mains'],)
      if (isRedirect) {
        return h.redirect(startPageUrl)
      } 
      const currentData = getYarValue(request, 'waterSourceCurrent') || null
      const plannedData = getYarValue(request, 'waterSourcePlanned') || null

      return h.view(viewTemplate, createModel(getYarValue(request, 'currentlyIrrigating'), null, currentData, plannedData, getYarValue(request, 'current-score'), getYarValue(request, 'mains')))
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
