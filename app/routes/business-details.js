const Joi = require('joi')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, businessDetails) {
  const {
    projectName,
    businessName,
    numberEmployees,
    businessTurnover,
    sbi
  } = businessDetails

  return {
    backLink: '/score',
    inputProjectName: {
      id: 'projectName',
      name: 'projectName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Project name',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      hint: {
        html: 'For example, Brown Hill Farm reservoir'
      },
      value: projectName,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    inputBusinessName: {
      id: 'businessName',
      name: 'businessName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business name',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      hint: {
        html: 'Enter business name as held by the Rural Payments Agency'
      },
      value: businessName,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    inputNumberEmployees: {
      id: 'numberEmployees',
      name: 'numberEmployees',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Number of employees',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      hint: {
        html: 'Full-time employees, including the owner'
      },
      value: numberEmployees,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    inputBusinessTurnover: {
      id: 'businessTurnover',
      name: 'businessTurnover',
      classes: 'govuk-input--width-10',
      prefix: {
        text: '£'
      },
      label: {
        text: 'Business turnover (£)',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      value: businessTurnover,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    inputSbi: {
      id: 'sbi',
      name: 'sbi',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Single Business Identifier (SBI)',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      hint: {
        html: 'If you do not have an SBI, leave it blank'
      },
      value: sbi,
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

/*
function createModelNotEligible () {
  return {
    backLink: '/business-details',
    messageContent:
    `You can only apply for a grant of up to <span class="govuk-!-font-weight-bold">40%</span> of the estimated costs.<br/><br/>
    The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £1 million.`
  }
}
*/

module.exports = [
  {
    method: 'GET',
    path: '/business-details',
    handler: (request, h) => {
      let businessDetails = request.yar.get('businessDetails') || null

      if (!businessDetails) {
        businessDetails = {
          projectName: null,
          businessName: null,
          numberEmployees: null,
          businessTurnover: null,
          sbi: null
        }
      }

      return h.view(
        'business-details',
        createModel(null, businessDetails)
      )
    }
  },
  {
    method: 'POST',
    path: '/business-details',
    options: {
      validate: {
        payload: Joi.object({
          // projectCost: Joi.number().integer().max(9999999).required()
        }),
        failAction: (request, h, err) => {
          const projectItemsList = request.yar.get('projectItemsList') || null

          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('business-details', createModel(errorMessage, null, projectItemsList)).takeover()
        }
      },
      handler: (request, h) => {
        /*
        const { projectCost } = request.payload
        const { calculatedGrant, remainingCost } = getGrantValues(projectCost)

        request.yar.set('projectCost', projectCost)
        request.yar.set('calculatedGrant', calculatedGrant)
        request.yar.set('remainingCost', remainingCost)

        if ((calculatedGrant < MIN_GRANT) || (calculatedGrant > MAX_GRANT)) {
          return h.view('./not-eligible', createModelNotEligible())
        }
        */
        return h.redirect('./confirm')
      }
    }
  }
]
