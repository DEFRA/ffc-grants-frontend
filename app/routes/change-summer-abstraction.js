const { setLabelData } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const { validateAnswerField } = require('../helpers/errorHelpers')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')
const { guardPage } = require('../helpers/page-guard')
const { startPageUrl } = require('../config/server')
const { UNSUSTAINABLE_WATER_SOURCE } = require('../helpers/water-source-data')
const viewTemplate = 'change-summer-abstraction'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/water-source`
const nextPath = `${urlPrefix}/irrigation-system`
const scorePath = `${urlPrefix}/score`

function createModel (unsustainableSourceType, summerAbstractChange, mainsChange, errorList, hasScore) {
  return {
    backLink: hasScore ? `${urlPrefix}/water-source` : previousPath,
    formActionPage: currentPath,
    hasScore: hasScore,
    displayMains: unsustainableSourceType.includes('Mains'),
    displaySummerObstraction: unsustainableSourceType.includes('Summer water surface abstraction'),
    ...errorList ? { errorList } : {},
    pageTitle: unsustainableSourceType.length > 1 ? 'How will your use of summer water surface abstraction and mains change?' : `How will your use of ${unsustainableSourceType[0].toLowerCase()} change?`,

    summerInput: {
      idPrefix: 'summerAbstractChange',
      name: 'summerAbstractChange',
      fieldset: {
        legend: {
          html: checkSingleUnsustainableSource(unsustainableSourceType, 'Summer water surface abstraction') ? '<h2 class="govuk-heading-m">Summer water surface abstraction</h2>' : ''
        }
      },
      items: setLabelData(summerAbstractChange, ['Decrease', 'No change']),
      ...(errorList && errorList[0].href === '#summerAbstractChange' ? { errorMessage: { text: errorList[0].text } } : {})
    },

    mainsInput: {
      idPrefix: 'mainsChange',
      name: 'mainsChange',
      fieldset: {
        legend: {
          html: checkSingleUnsustainableSource(unsustainableSourceType, 'Mains') ? '<h2 class="govuk-heading-m">Mains</h2>' : ''
        }
      },
      items: setLabelData(mainsChange, ['Decrease', 'No change']),
      ...(errorList && errorList[errorList.length - 1].href === '#mainsChange' ? { errorMessage: { text: errorList[errorList.length - 1].text } } : {})
    }
  }
}

function checkSingleUnsustainableSource (unsustainableSourceType, source) {
  return unsustainableSourceType.length > 1 && unsustainableSourceType.includes(source)
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const isRedirect = guardPage(request, ['waterSourcePlanned'])
      if (isRedirect) {
        return h.redirect(startPageUrl)
      }

      const summerAbstractChange = getYarValue(request, 'summerAbstractChange') || null
      const mainsChange = getYarValue(request, 'mainsChange') || null
      const unsustainableSourceType = getYarValue(request, 'waterSourcePlanned').filter(source => UNSUSTAINABLE_WATER_SOURCE.includes(source))

      return h.view(viewTemplate, createModel(unsustainableSourceType, summerAbstractChange, mainsChange, null, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {

      handler: (request, h) => {
        const { summerAbstractChange, mainsChange, results } = request.payload
        // const hasScore = getYarValue(request, 'current-score')
        // const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating')
        const unsustainableSourceType = getYarValue(request, 'waterSourcePlanned').filter(source => UNSUSTAINABLE_WATER_SOURCE.includes(source))
        const errorList = []
        const summerAbstractChangeError = unsustainableSourceType.includes('Summer water surface abstraction')
          ? (validateAnswerField(summerAbstractChange, 'NOT_EMPTY', {}, {}) === false)
          : null
        const mainsError = unsustainableSourceType.includes('Mains')
          ? (validateAnswerField(mainsChange, 'NOT_EMPTY', {}, {}) === false)
          : null

        if (summerAbstractChangeError) {
          errorList.push({
            text: 'Select how your use of summer abstraction will change',
            href: '#summerAbstractChange'
          })
        }
        if (mainsError) {
          errorList.push({
            text: 'Select how your use of mains will change',
            href: '#mainsChange'
          })
        }

        if (errorList.length > 0) {
          gapiService.sendValidationDimension(request)
          return h.view(viewTemplate, createModel(unsustainableSourceType, summerAbstractChange, mainsChange, errorList, getYarValue(request, 'current-score'))).takeover()
        }

        setYarValue(request, 'summerAbstractChange', summerAbstractChange)
        setYarValue(request, 'mainsChange', mainsChange)

        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
