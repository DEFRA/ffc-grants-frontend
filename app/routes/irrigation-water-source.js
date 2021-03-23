const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel(errorMessage, errorSummary, currentData, plannedData) {
  return {
    backLink: '/irrigated-land',
    ...errorSummary ? {
      errorList: errorSummary
    } : {},
    waterSourceCurrent: {
      idPrefix: 'waterSourceCurrent',
      name: 'waterSourceCurrent',
      fieldset: {
        legend: {
          text: 'Where does your current irrigation water come from?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(currentData, ['Peak flow surface water', 'Bore hole / aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains', 'Not currently irrigating']),
      ...(errorMessage && (!currentData || currentData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    },
    waterSourcePlanned: {
      idPrefix: 'waterSourcePlanned',
      name: 'waterSourcePlanned',
      fieldset: {
        legend: {
          text: 'Where will the irrigation water come from?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(plannedData, ['Peak flow surface water', 'Bore hole / aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}
getErrorSummary = (object) => {
  let errorList = []

}

module.exports = [
  {
    method: 'GET',
    path: '/irrigation-water-source',
    handler: (request, h) => {
      // const waterSourceCurrent = request.yar.get('waterSourceCurrent')
      // const waterSourcePlanned = request.yar.get('waterSourcePlanned')
      const currentData = request.yar.get('waterSourceCurrent') || null
      const plannedData = request.yar.get('waterSourcePlanned') || null
      return h.view('irrigation-water-source', createModel(null, null, currentData, plannedData))
    }
  },
  {
    method: 'POST',
    path: '/irrigation-water-source',
    options: {
      validate: {
        payload: Joi.object({
          waterSourceCurrent: [Joi.any().required()],
          waterSourcePlanned: Joi.any().required()
        }),
        failAction: (request, h, err) => {
          console.log(waterSourceCurrent,'PPPPPP')
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          let { waterSourceCurrent, waterSourcePlanned } = request.payload
          console.log(waterSourceCurrent,'PPPPPP')

          //waterSourceCurrent = waterSourceCurrent ? [waterSourceCurrent].flat() : waterSourceCurrent
          //waterSourcePlanned = waterSourcePlanned ? [waterSourcePlanned].flat() : waterSourcePlanned
          return h.view('irrigation-water-source', createModel(errorMessage, null, waterSourceCurrent, waterSourcePlanned)).takeover()
        }
      },
      handler: (request, h) => {
        let errorList = []
        let { waterSourceCurrent, waterSourcePlanned } = request.payload
        waterSourceCurrent = [waterSourceCurrent].flat()
        waterSourcePlanned = [waterSourcePlanned].flat()


        if (waterSourceCurrent.length > 2 || waterSourcePlanned.length > 2) {
          if (waterSourceCurrent.length > 2) {
            errorList.push({ 'text': 'Select where your current irrigation water comes from', 'href': '#waterSourceCurrent' })
          }
          if (waterSourcePlanned.length > 2) {
            errorList.push({ 'text': 'Select where your irrigation water will come from', 'href': '#waterSourcePlanned' })
          }
          return h.view('irrigation-water-source', createModel('Select one or two options', errorList, waterSourceCurrent, waterSourcePlanned))
            .takeover()
        }

        request.yar.set('waterSourceCurrent', waterSourceCurrent)
        request.yar.set('waterSourcePlanned', waterSourcePlanned)
        return h.redirect('./irrigation-systems')
      }
    }
  }
]
