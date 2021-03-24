const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, errorSummary, currentData, plannedData) {
  return {
    backLink: '/irrigation-water-source',
    ...errorSummary ? { errorList: errorSummary } : {},
    irrigationCurrent: {
      idPrefix: 'irrigationCurrent',
      name: 'irrigationCurrent',
      fieldset: {
        legend: {
          text: 'What systems are currently used to irrigate?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(currentData, ['Trickle', 'Boom irrigator', 'Ebb and flood or capillary bed', 'Sprinklers or mist', 'Rain gun', 'Not currently irrigating']),
      ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    },
    irrigationPlanned: {
      idPrefix: 'irrigationPlanned',
      name: 'irrigationPlanned',
      fieldset: {
        legend: {
          text: 'What systems will be used to irrigate?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(plannedData, ['Trickle', 'Boom irrigator', 'Ebb and flood or capillary bed', 'Sprinklers or mist', 'Rain gun']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/irrigation-systems',
    handler: (request, h) => {
      const currentData = request.yar.get('irrigationCurrent') || null
      const plannedData = request.yar.get('irrigationPlanned') || null
      return h.view('irrigation-systems', createModel(null, null, currentData, plannedData))
    }
  },
  {
    method: 'POST',
    path: '/irrigation-systems',
    options: {
      validate: {
        payload: Joi.object({
          irrigationCurrent: Joi.any().required(),
          irrigationPlanned: Joi.any().required()
        }),
        failAction: (request, h, err) => {
          let { irrigationCurrent, irrigationPlanned } = request.payload
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)

          irrigationCurrent = irrigationCurrent ? [irrigationCurrent].flat() : irrigationCurrent
          irrigationPlanned = irrigationPlanned ? [irrigationPlanned].flat() : irrigationPlanned
          return h.view('irrigation-systems', createModel(errorMessage, null, irrigationCurrent, irrigationPlanned)).takeover()
        }
      },
      handler: (request, h) => {
        let { irrigationCurrent, irrigationPlanned } = request.payload
        const errorList = []
        irrigationCurrent = [irrigationCurrent].flat()
        irrigationPlanned = [irrigationPlanned].flat()

        if (irrigationCurrent.length > 2 || irrigationPlanned.length > 2) {
          if (irrigationCurrent.length > 2) {
            errorList.push({ text: 'Select the systems currently used to irrigate', href: '#irrigationCurrent' })
          }
          if (irrigationPlanned.length > 2) {
            errorList.push({ text: 'Select the systems that will be used to irrigate', href: '#irrigationPlanned' })
          }
          return h.view('irrigation-systems', createModel('Select one or two options', errorList, irrigationCurrent, irrigationPlanned))
            .takeover()
        }

        request.yar.set('irrigationCurrent', irrigationCurrent)
        request.yar.set('irrigationPlanned', irrigationPlanned)
        return h.redirect('./productivity')
      }
    }
  }
]
