const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage, formatUKCurrency } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'remaining-costs'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/potential-amount`
const nextPath = `${urlPrefix}/SSSI`

function createModel (errorList, data, formattedRemainingCost) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'payRemainingCosts',
      name: 'payRemainingCosts',
      fieldset: {
        legend: {
          text: `Can you pay the remaining costs of £${formattedRemainingCost}?`,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    refTitle: 'Can you pay the remaining costs?',
    backLink: currentPath,
    messageContent:
      `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
    <div class="govuk-inset-text">
      You can use:
      <ul class="govuk-list govuk-list--bullet">
        <li>loans</li>
        <li>overdrafts</li>
        <li>the Basic Payment Scheme</li>
        <li>agri-environment schemes such as the Countryside Stewardship Scheme</li>
      </ul>
    </div>
    `,
    messageLink: {
      url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
      title: 'See other grants you may be eligible for.'
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const payRemainingCosts = getYarValue(request, 'payRemainingCosts') || null
      const remainingCost = getYarValue(request, 'remainingCost') || null
      if (!remainingCost) {
        return h.redirect(`${urlPrefix}/project-cost`)
      }

      const formattedRemainingCost = formatUKCurrency(remainingCost)
      return h.view(viewTemplate, createModel(null, payRemainingCosts, formattedRemainingCost))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          payRemainingCosts: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorList = []
          const errorObject = errorExtractor(err)
          const remainingCost = getYarValue(request, 'remainingCost') || null
          const formattedRemainingCost = formatUKCurrency(remainingCost)

          errorList.push({ text: getErrorMessage(errorObject), href: '#payRemainingCosts' })
          return h.view(viewTemplate, createModel(errorList, null, formattedRemainingCost)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'payRemainingCosts', request.payload.payRemainingCosts)
        await gapiService.sendEligibilityEvent(request, request.payload.payRemainingCosts === 'Yes')
        if (request.payload.payRemainingCosts === 'Yes') {
          return h.redirect(nextPath)
        }
        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
