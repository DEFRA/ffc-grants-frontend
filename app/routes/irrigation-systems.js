const Joi = require('joi')
const { setLabelData, findErrorList } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'irrigation-systems'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigation-water-source`
const nextPath = `${urlPrefix}/productivity`
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
      ? 'Will your irrigation system change?'
      : 'What systems will be used to irrigate?'
    ),

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
          text: 'What systems are currently used to irrigate?'
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
          text: currentlyIrrigating === 'yes' ? 'What systems will be used to irrigate?' : ''
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
          irrigationCurrent: Joi.any().required(),
          irrigationPlanned: Joi.any().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          let { irrigationCurrent, irrigationPlanned } = request.payload
          const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null
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
        const errorList = []
        irrigationCurrent = [irrigationCurrent].flat()
        irrigationPlanned = [irrigationPlanned].flat()
        const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

        if (irrigationCurrent.length > 2 || irrigationPlanned.length > 2) {
          if (irrigationCurrent.length > 2 || irrigationCurrent.length == 0) {
            errorList.push({ text: 'Select up to 2 systems currently used to irrigate', href: '#irrigationCurrent' })
          }
          if (irrigationPlanned.length > 2 || irrigationPlanned.length == 0) {
            errorList.push({ text: 'Select up to 2 systems that will be used to irrigate', href: '#irrigationPlanned' })
          }

          return h.view(
            viewTemplate,
            createModel(currentlyIrrigating, errorList, irrigationCurrent, irrigationPlanned, getYarValue(request, 'current-score'))
          )
        }

        setYarValue(request, 'irrigationCurrent', irrigationCurrent)
        setYarValue(request, 'irrigationPlanned', irrigationPlanned)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
