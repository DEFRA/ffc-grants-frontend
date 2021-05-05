const Joi = require('joi')
const { fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { IRRIGATED_LAND_REGEX } = require('../helpers/regex-validation')

function createModel (irrigatedLandCurrent, irrigatedLandTarget, errorMessageList) {
  const [
    irrigatedLandCurrentError,
    irrigatedLandTargetError
  ] = fetchListObjectItems(
    errorMessageList,
    ['irrigatedLandCurrentError', 'irrigatedLandTargetError']
  )
  return {
    backLink: '/irrigated-crops',
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
    path: '/irrigated-land',
    handler: (request, h) => {
      const irrigatedLandCurrent = request.yar.get('irrigatedLandCurrent')
      const irrigatedLandTarget = request.yar.get('irrigatedLandTarget')
      const currentData = irrigatedLandCurrent || null
      const TargetData = irrigatedLandTarget || null

      return h.view('irrigated-land', createModel(currentData, TargetData, null))
    }
  },
  {
    method: 'POST',
    path: '/irrigated-land',
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          irrigatedLandCurrent: Joi.string().regex(IRRIGATED_LAND_REGEX).required(),
          irrigatedLandTarget: Joi.string().regex(IRRIGATED_LAND_REGEX).required()
        }),
        failAction: (request, h, err) => {
          const [
            irrigatedLandCurrentError, irrigatedLandTargetError
          ] = findErrorList(err, ['irrigatedLandCurrent', 'irrigatedLandTarget'])

          const errorMessageList = {
            irrigatedLandCurrentError, irrigatedLandTargetError
          }

          const { irrigatedLandCurrent, irrigatedLandTarget } = request.payload
          return h.view('irrigated-land', createModel(irrigatedLandCurrent, irrigatedLandTarget, errorMessageList)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('irrigatedLandCurrent', request.payload.irrigatedLandCurrent)
        request.yar.set('irrigatedLandTarget', request.payload.irrigatedLandTarget)
        return h.redirect('./irrigation-water-source')
      }
    }
  }
]
