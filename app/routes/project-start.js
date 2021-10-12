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

function createModel (errorList, data, backLink) {
  return {
    backLink: backLink,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},
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
      items: setLabelData(data,
        [
          {
            text: 'Yes, preparatory work',
            value: 'Yes, preparatory work',
            hint: {
              text: 'For example, quotes from suppliers, applying for planning permission'
            }
          },
          {
            text: 'Yes, we have begun project work',
            value: 'Yes, we have begun project work',
            hint: {
              text: 'For example, digging, signing contracts, placing orders'
            }
          },
          'No, we have not done any work on this project yet'
        ]),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

const getBackLink = (request) => {
  const planningPermission = getYarValue(request, 'planningPermission')
  return (planningPermission === LICENSE_EXPECTED) ? planningCaveatPath : planningPath
}

function createModelNotEligible () {
  return {
    refTitle: 'Have you already started work on the project?',
    backLink: currentPath,
    messageContent:
      'You cannot apply for a grant if you have already started work on the project.',
    insertText: {
      text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.'
    },
    messageLink: {
      url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
      title: 'See other grants you may be eligible for.'
    }
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
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          const errorList = []
          errorList.push({ text: getErrorMessage(errorObject), href: '#projectStarted' })
          return h.view(viewTemplate, createModel(errorList, null, getBackLink(request))).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'projectStarted', request.payload.projectStarted)

        if (request.payload.projectStarted !== 'Yes, we have begun project work') {
          return h.redirect(nextPath)
        }
        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
