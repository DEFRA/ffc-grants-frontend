const Joi = require('joi')
const { fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { IRRIGATED_LAND_REGEX, ONLY_ZEROES_REGEX } = require('../helpers/regex-validation')
const { setYarValue, getYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'irrigated-land'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigated-crops`
const nextPath = `${urlPrefix}/irrigation-water-source`
const scorePath = `${urlPrefix}/score`

function createModel (irrigatedLandCurrent, irrigatedLandTarget, errorMessageList, hasScore) {
  const [
    irrigatedLandCurrentError,
    irrigatedLandTargetError
  ] = fetchListObjectItems(
    errorMessageList,
    ['irrigatedLandCurrentError', 'irrigatedLandTargetError']
  )
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    hasScore: hasScore,
    currentInput: {
      label: {
        text: 'How much land is currently irrigated per year?',
        isPageHeading: true,
        classes: 'govuk-label--l'
      },
      classes: 'govuk-input--width-4',
      id: 'irrigatedLandCurrent',
      name: 'irrigatedLandCurrent',
      suffix: {
        text: 'ha'
      },
      hint: {
        html: '<span class="govuk-label"> Hectares </span>Enter figure in hectares, for example 543.5'
      },
      ...(irrigatedLandCurrent ? { value: irrigatedLandCurrent } : {}),
      ...(irrigatedLandCurrentError ? { errorMessage: { text: irrigatedLandCurrentError } } : {})
    },
    targetInput: {
      label: {
        text: 'How much land will be irrigated after the project?',
        isPageHeading: true,
        classes: 'govuk-label--l'
      },
      classes: 'govuk-input--width-4',
      id: 'irrigatedLandTarget',
      name: 'irrigatedLandTarget',
      hint: {
        html: '<span class="govuk-label"> Hectares </span>Enter figure in hectares, for example 543.5'
      },
      suffix: {
        text: 'ha'
      },
      ...(irrigatedLandTarget ? { value: irrigatedLandTarget } : {}),
      ...(irrigatedLandTargetError ? { errorMessage: { text: irrigatedLandTargetError } } : {})
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

      return h.view(viewTemplate, createModel(currentData, TargetData, null, getYarValue(request, 'current-score')))
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
          let [
            irrigatedLandCurrentError, irrigatedLandTargetError
          ] = findErrorList(err, ['irrigatedLandCurrent', 'irrigatedLandTarget'])

          if (!irrigatedLandTargetError && ONLY_ZEROES_REGEX.test(request.payload.irrigatedLandTarget)) {
            irrigatedLandTargetError = 'Figure must be higher than 0'
          }

          const errorMessageList = {
            irrigatedLandCurrentError, irrigatedLandTargetError
          }

          const { irrigatedLandCurrent, irrigatedLandTarget } = request.payload
          return h.view(viewTemplate, createModel(irrigatedLandCurrent, irrigatedLandTarget, errorMessageList, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const { irrigatedLandCurrent, irrigatedLandTarget, results } = request.payload
        const hasScore = getYarValue(request, 'current-score')
        if (Number(irrigatedLandTarget) === 0 ||
            (Number(irrigatedLandTarget) < Number(irrigatedLandCurrent))
        ) {
          const irrigatedLandCurrentError = null
          const irrigatedLandTargetError = (Number(irrigatedLandTarget) === 0)
            ? 'Figure must be higher than 0'
            : 'Figure must be equal to or higher than current hectares'

          const errorMessageList = {
            irrigatedLandCurrentError,
            irrigatedLandTargetError
          }

          return h.view(viewTemplate, createModel(irrigatedLandCurrent, irrigatedLandTarget, errorMessageList, hasScore))
        }

        setYarValue(request, 'irrigatedLandCurrent', irrigatedLandCurrent)
        setYarValue(request, 'irrigatedLandTarget', irrigatedLandTarget)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
