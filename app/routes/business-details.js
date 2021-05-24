const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { NUMBER_REGEX } = require('../helpers/regex-validation')

function createModel (errorMessageList, businessDetails) {
  const {
    projectName,
    businessName,
    numberEmployees,
    businessTurnover,
    sbi
  } = businessDetails

  const [
    projectNameError,
    businessNameError,
    numberEmployeesError,
    businessTurnoverError,
    sbiError
  ] = fetchListObjectItems(
    errorMessageList,
    ['projectNameError', 'businessNameError', 'numberEmployeesError', 'businessTurnoverError', 'sbiError']
  )

  return {
    backLink: './next-steps',
    inputProjectName: {
      id: 'projectName',
      name: 'projectName',
      classes: '',
      label: {
        text: 'Project name',
        classes: 'govuk-label',
        isPageHeading: true
      },
      hint: {
        html: 'For example, Brown Hill Farm reservoir'
      },
      ...(projectName ? { value: projectName } : {}),
      ...(projectNameError ? { errorMessage: { text: projectNameError } } : {})
    },
    inputBusinessName: {
      id: 'businessName',
      name: 'businessName',
      classes: '',
      label: {
        text: 'Business name',
        classes: 'govuk-label',
        isPageHeading: true
      },
      hint: {
        html: 'If you’re registered on the Rural Payments system, enter business name as registered'
      },
      ...(businessName ? { value: businessName } : {}),
      ...(businessNameError ? { errorMessage: { text: businessNameError } } : {})
    },
    inputNumberEmployees: {
      id: 'numberEmployees',
      name: 'numberEmployees',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Number of employees',
        classes: 'govuk-label',
        isPageHeading: true
      },
      hint: {
        html: 'Full-time employees, including the owner'
      },
      ...(numberEmployees ? { value: numberEmployees } : {}),
      ...(numberEmployeesError ? { errorMessage: { text: numberEmployeesError } } : {})
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
        classes: 'govuk-label',
        isPageHeading: true
      },
      ...(businessTurnover ? { value: businessTurnover } : {}),
      ...(businessTurnoverError ? { errorMessage: { text: businessTurnoverError } } : {})
    },
    inputSbi: {
      id: 'sbi',
      name: 'sbi',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Single Business Identifier (SBI)',
        classes: 'govuk-label',
        isPageHeading: true
      },
      hint: {
        html: 'If you do not have an SBI, leave it blank'
      },
      ...(sbi ? { value: sbi } : {}),
      ...(sbiError ? { errorMessage: { text: sbiError } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/business-details',
    handler: (request, h) => {
      let businessDetails = getYarValue(request, 'businessDetails') || null

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
        options: { abortEarly: false },
        payload: Joi.object({
          projectName: Joi.string().required(),
          businessName: Joi.string().max(100).required(),
          numberEmployees: Joi.string().regex(NUMBER_REGEX).max(7).required(),
          businessTurnover: Joi.string().regex(NUMBER_REGEX).max(9).required(),
          sbi: Joi.string().regex(NUMBER_REGEX).min(9).max(9).allow('')
        }),
        failAction: (request, h, err) => {
          const [
            projectNameError, businessNameError, numberEmployeesError, businessTurnoverError, sbiError
          ] = findErrorList(err, ['projectName', 'businessName', 'numberEmployees', 'businessTurnover', 'sbi'])

          const errorMessageList = {
            projectNameError, businessNameError, numberEmployeesError, businessTurnoverError, sbiError
          }

          const { projectName, businessName, numberEmployees, businessTurnover, sbi } = request.payload
          const businessDetails = { projectName, businessName, numberEmployees, businessTurnover, sbi }

          return h.view('business-details', createModel(errorMessageList, businessDetails)).takeover()
        }
      },
      handler: (request, h) => {
        const {
          projectName, businessName, numberEmployees, businessTurnover, sbi
        } = request.payload

        setYarValue(request, 'businessDetails', {
          projectName, businessName, numberEmployees, businessTurnover, sbi
        })

        return h.redirect('./applying')
      }
    }
  }
]
