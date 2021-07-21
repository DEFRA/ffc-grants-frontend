const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { isChecked, getSbiHtml, fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { NUMBER_REGEX } = require('../helpers/regex-validation')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'business-details'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/score`
const nextPath = `${urlPrefix}/applying`
const detailsPath = `${urlPrefix}/check-details`

function createModel (errorMessageList, businessDetails, hasDetails) {
  const {
    projectName,
    businessName,
    numberEmployees,
    businessTurnover,
    sbi,
    inSbi
  } = businessDetails

  const [
    projectNameError,
    businessNameError,
    numberEmployeesError,
    businessTurnoverError,
    sbiError, inSbiError
  ] = fetchListObjectItems(
    errorMessageList,
    ['projectNameError', 'businessNameError', 'numberEmployeesError', 'businessTurnoverError', 'sbiError', 'inSbiError']
  )
  console.log(errorMessageList, 'Error messages')
  console.log(inSbiError, 'Error messages')
  const sbiHtml = getSbiHtml(sbi, sbiError)
  return {
    backLink: previousPath,
    checkDetail: hasDetails,
    formActionPage: currentPath,
    inputProjectName: {
      id: 'projectName',
      name: 'projectName',
      classes: '',
      label: {
        text: 'Project name',
        classes: 'govuk-label'
      },
      hint: {
        text: 'For example, Brown Hill Farm reservoir'
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
        classes: 'govuk-label'
      },
      hint: {
        text: 'If you’re registered on the Rural Payments system, enter business name as registered'
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
        classes: 'govuk-label'
      },
      hint: {
        text: 'Full-time employees, including the owner'
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
        classes: 'govuk-label'
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
        classes: 'govuk-label'
      },
      hint: {
        text: 'If you do not have an SBI, leave it blank'
      },
      ...(sbi ? { value: sbi } : {}),
      ...(sbiError ? { errorMessage: { text: sbiError } } : {})
    },
    radios: {
      idPrefix: 'inSbi',
      name: 'inSbi',
      hint: {
        text: 'Select one option'
      },
      fieldset: {
        legend: {
          text: 'Single Business Identifier (SBI)',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          conditional: {
            html: sbiHtml
          },
          checked: isChecked(inSbi, 'Yes')
        },
        {
          value: 'No',
          text: 'No',
          checked: isChecked(inSbi, 'No')
        }
      ],
      ...(inSbiError ? { errorMessage: { text: inSbiError } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      let businessDetails = getYarValue(request, 'businessDetails') || null

      if (!businessDetails) {
        businessDetails = {
          projectName: null,
          businessName: null,
          numberEmployees: null,
          businessTurnover: null,
          sbi: null,
          inSbi: false
        }
      }

      return h.view(viewTemplate, createModel(null, businessDetails, getYarValue(request, 'checkDetails')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          projectName: Joi.string().required(),
          businessName: Joi.string().max(100).required(),
          numberEmployees: Joi.string().regex(NUMBER_REGEX).max(7).required(),
          businessTurnover: Joi.string().regex(NUMBER_REGEX).max(9).required(),
          sbi: Joi.string().allow(''),
          inSbi: Joi.string().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          const [
            projectNameError, businessNameError, numberEmployeesError, businessTurnoverError, sbiError, inSbiError
          ] = findErrorList(err, ['projectName', 'businessName', 'numberEmployees', 'businessTurnover', 'sbi', 'inSbi'])

          const errorMessageList = {
            projectNameError, businessNameError, numberEmployeesError, businessTurnoverError, sbiError, inSbiError
          }
          const { projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi } = request.payload
          const businessDetails = { projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi }

          return h.view(viewTemplate, createModel(errorMessageList, businessDetails, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: (request, h) => {
        let {
          projectName, businessName, numberEmployees, businessTurnover, sbi, results, inSbi
        } = request.payload
        sbi = inSbi === 'Yes' ? sbi : ''
        if (inSbi === 'Yes' && sbi) {
          const sbiError = { sbiError: sbi.trim() === '' ? 'Enter an SBI number, like 011115678' : 'SBI number must have 9 characters, like 011115678', href: '#sbi' }
          if (!(sbi.trim() !== '' && sbi.match(NUMBER_REGEX) && sbi.length === 9)) {
            return h.view(viewTemplate, createModel(sbiError, request.payload, getYarValue(request, 'checkDetails')))
          }
        }
        setYarValue(request, 'businessDetails', {
          projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi
        })

        return results ? h.redirect(detailsPath) : h.redirect(nextPath)
      }
    }
  }
]
