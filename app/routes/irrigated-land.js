const Joi = require('joi')
const { findErrorList } = require('../helpers/helper-functions')
const { IRRIGATED_LAND_REGEX, ONLY_ZEROES_REGEX } = require('../helpers/regex-validation')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'irrigated-land'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigation-status`
const nextPath = `${urlPrefix}/irrigation-water-source`
const scorePath = `${urlPrefix}/score`

function createModel (currentlyIrrigating, irrigatedLandCurrent, irrigatedLandTarget, errorList, hasScore) {
  currentlyIrrigating = currentlyIrrigating.toLowerCase()
  return {
    backLink: hasScore ? `${urlPrefix}/irrigated-crops` : previousPath,
    formActionPage: currentPath,
    hasScore: hasScore,
    ...errorList ? { errorList } : {},
    currentlyIrrigating: (currentlyIrrigating === 'yes'),
    pageTitle: (currentlyIrrigating === 'yes'
      ? 'Irrigated land'
      : 'How much land will be irrigated per year after the project?'
    ),
    hiddenInput: {
      id: 'irrigatedLandCurrent',
      name: 'irrigatedLandCurrent',
      value: '0',
      type: 'hidden'
    },
    currentInput: {
      classes: 'govuk-input--width-4',
      id: 'irrigatedLandCurrent',
      name: 'irrigatedLandCurrent',
      type: 'number',
      suffix: {
        text: 'ha'
      },
      label: {
        html: '<h2>How much land is currently irrigated per year?</h2>'
      },
      hint: {
        text: 'Enter figure in hectares (ha), for example 543.5'
      },
      ...(irrigatedLandCurrent ? { value: irrigatedLandCurrent } : {}),
      ...(errorList && errorList[0].href === '#irrigatedLandCurrent' ? { errorMessage: { text: errorList[0].text } } : {})
    },
    targetInput: {
      classes: 'govuk-input--width-4',
      id: 'irrigatedLandTarget',
      name: 'irrigatedLandTarget',
      label: {
        html: currentlyIrrigating === 'yes' ? '<h2>How much land will be irrigated per year after the project?</h2>' : ''
      },
      hint: {
        text: 'Enter figure in hectares (ha), for example 543.5'
      },
      type: 'number',
      suffix: {
        text: 'ha'
      },
      ...(irrigatedLandTarget ? { value: irrigatedLandTarget } : {}),
      ...(errorList && errorList[errorList.length - 1].href === '#irrigatedLandTarget' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const irrigatedLandCurrent = getYarValue(request, 'irrigatedLandCurrent')
      const irrigatedLandTarget = getYarValue(request, 'irrigatedLandTarget')
      const currentData = irrigatedLandCurrent || null
      const TargetData = irrigatedLandTarget || null
      const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

      return h.view(viewTemplate, createModel(currentlyIrrigating, currentData, TargetData, null, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          irrigatedLandCurrent: Joi.string().regex(IRRIGATED_LAND_REGEX).required(),
          irrigatedLandTarget: Joi.string().regex(IRRIGATED_LAND_REGEX).required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorList = []
          let [
            irrigatedLandCurrentError, irrigatedLandTargetError
          ] = findErrorList(err, ['irrigatedLandCurrent', 'irrigatedLandTarget'])

          if (!irrigatedLandTargetError && ONLY_ZEROES_REGEX.test(request.payload.irrigatedLandTarget)) {
            irrigatedLandTargetError = 'Figure must be higher than 0'
          }

          if (irrigatedLandCurrentError) {
            errorList.push({
              text: irrigatedLandCurrentError,
              href: '#irrigatedLandCurrent'
            })
          }

          if (irrigatedLandTargetError) {
            errorList.push({
              text: irrigatedLandTargetError,
              href: '#irrigatedLandTarget'
            })
          }

          const { irrigatedLandCurrent, irrigatedLandTarget } = request.payload
          const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

          return h.view(viewTemplate, createModel(currentlyIrrigating, irrigatedLandCurrent, irrigatedLandTarget, errorList, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const { irrigatedLandCurrent, irrigatedLandTarget, results } = request.payload
        const hasScore = getYarValue(request, 'current-score')
        const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

        if (Number(irrigatedLandTarget) === 0 ||
            (Number(irrigatedLandTarget) < Number(irrigatedLandCurrent))
        ) {
          const irrigatedLandCurrentError = null
          const irrigatedLandTargetError = (Number(irrigatedLandTarget) === 0)
            ? 'Figure must be higher than 0'
            : 'Figure must be equal to or higher than current hectares'

          const errorList = [{
            text: irrigatedLandCurrentError,
            href: '#irrigatedLandCurrent'
          },
          {
            text: irrigatedLandTargetError,
            href: '#irrigatedLandTarget'
          }
          ]

          return h.view(viewTemplate, createModel(currentlyIrrigating, irrigatedLandCurrent, irrigatedLandTarget, errorList, hasScore))
        }

        setYarValue(request, 'irrigatedLandCurrent', irrigatedLandCurrent)
        setYarValue(request, 'irrigatedLandTarget', irrigatedLandTarget)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
