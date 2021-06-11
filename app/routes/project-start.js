const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const { LICENSE_EXPECTED } = require('../helpers/license-dates')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'project-start'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/tenancy`
const planningPath = `${urlPrefix}/planning-permission`
const planningCaveatPath = `${urlPrefix}/planning-required-condition`

function createModel (errorMessage, data, backLink) {
  return {
    backLink: backLink,
    formActionPage: currentPath,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'projectStarted',
      name: 'projectStarted',
      fieldset: {
        legend: {
          text: 'Have you already started work on the project?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes, preparatory work (for example quotes from suppliers, applying for planning permission)',
        'Yes, we have begun project work (for example digging, signing contracts, placing orders)',
        'No, we have not done any work on this project yet']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

const getBackLink = (request) => {
  const planningPermission = getYarValue(request, 'planningPermission')
  return (planningPermission === LICENSE_EXPECTED) ? planningCaveatPath : planningPath
}

function createModelNotEligible () {
  return {
    backLink: currentPath,
    messageContent:
      'Only projects that have not yet started can apply for a grant.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const projectStarted = getYarValue(request, 'projectStarted')
      const data = projectStarted || null
      return h.view(viewTemplate, createModel(null, data, getBackLink(request)))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          projectStarted: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage, null, getBackLink(request))).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'projectStarted', request.payload.projectStarted)
        await gapiService.sendEligibilityEvent(request, request.payload.projectStarted === 'Yes, we have begun project work (for example digging, signing contracts, placing orders)')

        if (request.payload.projectStarted !== 'Yes, we have begun project work (for example digging, signing contracts, placing orders)') {
          return h.redirect(nextPath)
        }

        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
