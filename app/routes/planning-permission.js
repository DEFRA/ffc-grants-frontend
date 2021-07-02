const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'planning-permission'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/country`
const nextPath = `${urlPrefix}/project-start`
const caveatPath = `${urlPrefix}/planning-required-condition`

function createModel (errorMessage, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    radios: {
      idPrefix: 'planningPermission',
      name: 'planningPermission',
      fieldset: {
        legend: {
          text: 'Does the project need planning permission?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, [LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE]),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

const NOT_ELIGIBLE = {
  backLink: currentPath,
  messageContent: 'Any planning permission must be in place by 31 December 2021 (the end of the application window).',
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
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
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
