const Joi = require('joi')
const { setLabelData, findErrorList } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'irrigation-systems'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigation-water-source`
const nextPath = `${urlPrefix}/irrigated-crops`
const scorePath = `${urlPrefix}/score`

function createModel (currentlyIrrigating, errorList, currentData, plannedData, hasScore) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore,
    ...errorList ? { errorList } : {},
    currentlyIrrigating: (currentlyIrrigating === 'Yes'),
    pageTitle: (currentlyIrrigating === 'Yes' ? 'Irrigation system' : 'What systems will be used to irrigate?'),

    mockCheckbox: {
      id: 'irrigationCurrent',
      name: 'irrigationCurrent',
      value: 'Not currently irrigating',
      type: 'hidden'
    },

    irrigationCurrent: {
      idPrefix: 'irrigationCurrent',
      name: 'irrigationCurrent',
      fieldset: {
        legend: {
          html: '<h2 class="govuk-heading-m">What systems are currently used to irrigate?</h2>'
        }
      },
      hint: {
        text: 'Select up to 2 options'
      },
      items: setLabelData(currentData,
        ['Boom', 'Capillary bed', 'Ebb and flow', 'Mist', 'Rain gun', 'Sprinklers', 'Trickle']),
      ...(errorList && errorList[0].href === '#irrigationCurrent' ? { errorMessage: { text: errorList[0].text } } : {})
    },
    irrigationPlanned: {
      idPrefix: 'irrigationPlanned',
      name: 'irrigationPlanned',
      fieldset: {
        legend: {
          html: currentlyIrrigating === 'Yes' ? '<h2 class="govuk-heading-m">What systems will be used to irrigate?</h2>' : ''
        }
      },
      hint: {
        text: 'Select up to 2 options'
      },
      items: setLabelData(plannedData, ['Boom', 'Capillary bed', 'Ebb and flow', 'Mist', 'Rain gun', 'Sprinklers', 'Trickle']),
      ...(errorList && errorList[errorList.length - 1].href === '#irrigationPlanned' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
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

      const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating')
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
          irrigationCurrent: Joi.array().max(2).single().required(),
          irrigationPlanned: Joi.array().max(2).single().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          let { irrigationCurrent, irrigationPlanned } = request.payload
          const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating')
          const errorList = []
          const [
            irrigationCurrentError, irrigationPlannedError
          ] = findErrorList(err, ['irrigationCurrent', 'irrigationPlanned'])

          if (irrigationCurrentError) {
            errorList.push({
              text: irrigationCurrentError,
              href: '#irrigationCurrent'
            })
          }

          if (irrigationPlannedError) {
            errorList.push({
              text: irrigationPlannedError,
              href: '#irrigationPlanned'
            })
          }

          irrigationCurrent = irrigationCurrent ? [irrigationCurrent].flat() : irrigationCurrent
          irrigationPlanned = irrigationPlanned ? [irrigationPlanned].flat() : irrigationPlanned

          return h.view(viewTemplate, createModel(currentlyIrrigating, errorList, irrigationCurrent, irrigationPlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { irrigationCurrent, irrigationPlanned, results } = request.payload
        irrigationCurrent = [irrigationCurrent].flat()
        irrigationPlanned = [irrigationPlanned].flat()

        setYarValue(request, 'irrigationCurrent', irrigationCurrent)
        setYarValue(request, 'irrigationPlanned', irrigationPlanned)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
