const Joi = require('joi')
const { setLabelData, findErrorList, getPlannedWaterSourceOptions } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')
const { guardPage } = require('../helpers/page-guard')
const { startPageUrl } = require('../config/server')

const viewTemplate = 'water-source'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/summer-abstraction-mains`
const nextPath = `${urlPrefix}/irrigation-system`
const scorePath = `${urlPrefix}/score`
const { WATER_SOURCE } = require('../helpers/water-source-data')

function createModel (currentlyIrrigating, errorList, currentData, plannedData, hasScore) {
  return {
    backLink: previousPath,
    preValidationKeys: ['summerAbstractionMains'],
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
          html: '<h2 class="govuk-heading-m">What is your current water source?</h2>'
        }
      },
      hint: {
        text: 'Select all that apply'
      },
      items: setLabelData(currentData, WATER_SOURCE),
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
        text: 'Select all that apply'
      },
      items: setLabelData(plannedData, getPlannedWaterSourceOptions(currentlyIrrigating)),
      ...(errorList && errorList[errorList.length - 1].href === '#waterSourcePlanned' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const isRedirect = guardPage(request, ['summerAbstractionMains'])
      if (isRedirect) {
        return h.redirect(startPageUrl)
      } 


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
          waterSourceCurrent: Joi.array().single().required(),
          waterSourcePlanned: Joi.array().single().required(),
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