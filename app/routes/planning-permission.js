const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { LICENSE_NOT_NEEDED, LICENSE_SECURED } = require('../helpers/license-dates')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')
const LICENSE_WILL_NOT_HAVE = 'Will not be in place by 31 January 2023'
const LICENSE_EXPECTED = 'Should be in place by 31 January 2023'
const viewTemplate = 'planning-permission'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/country`
const nextPath = `${urlPrefix}/project-start`
const caveatPath = `${urlPrefix}/planning-required-condition`

function createModel (errorList, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},

    radios: {
      idPrefix: 'planningPermission',
      name: 'planningPermission',
      fieldset: {
        legend: {
          text: 'Does the project have planning permission?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, [LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE]),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

const NOT_ELIGIBLE = {
  refTitle: 'Planning permission',
  backLink: currentPath,
  messageContent: 'Any planning permission must be in place by 31 January 2023 (the end of the application window).',
  messageLink: {
    url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
    title: 'See other grants you may be eligible for.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const planningPermission = getYarValue(request, 'planningPermission') || null
      return h.view(viewTemplate, createModel(null, planningPermission))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          planningPermission: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorList = []
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#planningPermission' })
          return h.view(viewTemplate, createModel(errorList)).takeover()
        }
      },
      handler: async (request, h) => {
        const { planningPermission } = request.payload
        setYarValue(request, 'planningPermission', planningPermission)

        if (planningPermission === LICENSE_WILL_NOT_HAVE) {
          return h.view('not-eligible', NOT_ELIGIBLE)
        }

        if (planningPermission === LICENSE_EXPECTED) {
          return h.redirect(caveatPath)
        }

        return h.redirect(nextPath)
      }
    }
  }
]
