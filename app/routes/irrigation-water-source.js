const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')

const pageDetails = require('../helpers/page-details')('Q17')

function createModel (errorMessage, errorSummary, currentData, plannedData, hasScore) {
  return {
    backLink: pageDetails.previousPath,
    formActionPage: pageDetails.path,
    hasScore: hasScore,
    ...errorSummary ? { errorList: errorSummary } : {},
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
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(currentData, ['Peak-flow surface water', 'Bore hole/aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains', 'Not currently irrigating']),
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
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(plannedData, ['Peak-flow surface water', 'Bore hole/aquifer', 'Rain water harvesting', 'Summer water surface abstraction', 'Mains']),
      ...(errorMessage && (!plannedData || plannedData.length > 2) ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: pageDetails.path,
    handler: (request, h) => {
      const currentData = getYarValue(request, 'waterSourceCurrent') || null
      const plannedData = getYarValue(request, 'waterSourcePlanned') || null
      return h.view(pageDetails.template, createModel(null, null, currentData, plannedData, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          waterSourceCurrent: Joi.any().required(),
          waterSourcePlanned: Joi.any().required(),
          results: Joi.any()

        }),
        failAction: (request, h, err) => {
          let { waterSourceCurrent, waterSourcePlanned } = request.payload

          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)

          waterSourceCurrent = waterSourceCurrent ? [waterSourceCurrent].flat() : waterSourceCurrent
          waterSourcePlanned = waterSourcePlanned ? [waterSourcePlanned].flat() : waterSourcePlanned
          return h.view(pageDetails.template, createModel(errorMessage, null, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const errorList = []
        let { waterSourceCurrent, waterSourcePlanned, results } = request.payload

        waterSourceCurrent = [waterSourceCurrent].flat()
        waterSourcePlanned = [waterSourcePlanned].flat()

        if (waterSourceCurrent.length > 2 || waterSourcePlanned.length > 2) {
          if (waterSourceCurrent.length > 2) {
            errorList.push({ text: 'Select where your current irrigation water comes from', href: '#waterSourceCurrent' })
          }
          if (waterSourcePlanned.length > 2) {
            errorList.push({ text: 'Select where your irrigation water will come from', href: '#waterSourcePlanned' })
          }
          return h.view(pageDetails.template, createModel('Select one or two options', errorList, waterSourceCurrent, waterSourcePlanned, getYarValue(request, 'current-score')))
        }

        setYarValue(request, 'waterSourceCurrent', waterSourceCurrent)
        setYarValue(request, 'waterSourcePlanned', waterSourcePlanned)
        return results ? h.redirect(`${pageDetails.pathPrefix}/score`) : h.redirect(pageDetails.nextPath)
      }
    }
  }
]
