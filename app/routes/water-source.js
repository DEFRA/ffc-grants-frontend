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
const { WATER_SOURCE, UNSUSTAINABLE_WATER_SOURCE } = require('../helpers/water-source-data')

let waterSourceArray = []
let waterSourcePlannedArray = []
const schema = Joi.object({
  waterSourceCurrent: Joi.array().single().required().custom((value, helper) => {
    waterSourceArray = value.filter((item) => UNSUSTAINABLE_WATER_SOURCE.includes(item))
    return value
  }),
  waterSourcePlanned: Joi.array().single().required().custom((value, helper) => {
    waterSourcePlannedArray = value.filter((item) => UNSUSTAINABLE_WATER_SOURCE.includes(item))

    // if the user has selected a planned unsustainable water source that they are NOT currently using
    const newUnsustainableWaterSourcesPlanned = waterSourceArray.length === 0 && waterSourcePlannedArray.length > 0;
    if (newUnsustainableWaterSourcesPlanned) {
      waterSourceArray = []
      waterSourcePlannedArray = []
      return helper.error('custom')
    }

    if (waterSourceArray.length > 0 && waterSourcePlannedArray.length > 0) {
      const newUnsustainableWaterSources = waterSourcePlannedArray.filter((item) => !waterSourceArray.includes(item))
      // if the user has selected an unsustainable water source that they are NOT currently using
      if (newUnsustainableWaterSources.length > 0 || newUnsustainableWaterSourcesPlanned) {
        waterSourceArray = []
        waterSourcePlannedArray = []
        return helper.error('custom')
      }

      return value
    }

    return value
  }),
  results: Joi.any()
});

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
    handler: async (request, h) => {
      const isRedirect = guardPage(request, ['summerAbstractionMains'])
      if (isRedirect) {
        return h.redirect(startPageUrl)
      }
      const currentData = getYarValue(request, 'waterSourceCurrent') || null
      const plannedData = getYarValue(request, 'waterSourcePlanned') || null

      await gapiService.sendGAEvent(request, { name: 'eligibility_passed', params: { } })

      return h.view(viewTemplate, createModel(getYarValue(request, 'currentlyIrrigating'), null, currentData, plannedData, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: schema,
        failAction: (request, h, err) => {
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

          setYarValue(request, 'summerAbstractChange', null)
          setYarValue(request, 'mainsChange', null)

          return h.view(viewTemplate, createModel(getYarValue(request, 'currentlyIrrigating'), errorList, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { waterSourceCurrent, waterSourcePlanned } = request.payload
        waterSourceCurrent = [waterSourceCurrent].flat()
        waterSourcePlanned = [waterSourcePlanned].flat()
        const nextPath = waterSourcePlanned.some(source => UNSUSTAINABLE_WATER_SOURCE.includes(source)) ? `${urlPrefix}/change-summer-abstraction` : `${urlPrefix}/irrigation-system`

        setYarValue(request, 'waterSourceCurrent', waterSourceCurrent)
        setYarValue(request, 'waterSourcePlanned', waterSourcePlanned)

        setYarValue(request, 'summerAbstractChange', null)
        setYarValue(request, 'mainsChange', null)

        return h.redirect(nextPath)
      }
    }
  }
]
