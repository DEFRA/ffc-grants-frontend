const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { isChecked, getSbiHtml, findErrorList } = require('../helpers/helper-functions')
const { NUMBER_REGEX } = require('../helpers/regex-validation')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'business-details'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/score`
const nextPath = `${urlPrefix}/applying`
const detailsPath = `${urlPrefix}/check-details`

function createModel (errorList, businessDetails, sbiHtml, hasDetails) {
  const {
    projectName,
    businessName,
    numberEmployees,
    businessTurnover,
    inSbi
  } = businessDetails

  return {
    backLink: previousPath,
    checkDetail: hasDetails,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},

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
      ...(errorList && errorList.some(err => err.href === '#projectName') ? { errorMessage: { text: errorList.find(err => err.href === '#projectName').text } } : {})
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
      ...(errorList && errorList.some(err => err.href === '#businessName') ? { errorMessage: { text: errorList.find(err => err.href === '#businessName').text } } : {})
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
      ...(errorList && errorList.some(err => err.href === '#numberEmployees') ? { errorMessage: { text: errorList.find(err => err.href === '#numberEmployees').text } } : {})
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
      ...(errorList && errorList.some(err => err.href === '#businessTurnover') ? { errorMessage: { text: errorList.find(err => err.href === '#businessTurnover').text } } : {})
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
      ...(errorList && errorList.some(err => err.href === '#inSbi') ? { errorMessage: { text: errorList.find(err => err.href === '#inSbi').text } } : {})
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
      const inSbi = businessDetails.inSbi ?? null
      const sbiData = inSbi !== null ? businessDetails.sbi : null
      const sbiHtml = getSbiHtml(sbiData)

      return h.view(viewTemplate, createModel(null, businessDetails, sbiHtml, getYarValue(request, 'checkDetails')))
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
          sbi: Joi.string().regex(NUMBER_REGEX).min(9).max(9).allow(''),
          inSbi: Joi.string().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          let sbiError
          const fields = ['projectName', 'businessName', 'numberEmployees', 'businessTurnover', 'inSbi', 'sbi']
          fields.forEach(field => {
            const fieldError = findErrorList(err, [field])[0]
            if (fieldError) {
              if (field === 'sbi') {
                sbiError = { text: fieldError, href: `#${field}` }
              }
              errorList.push({
                text: fieldError,
                href: `#${field}`
              })
            }
          })

          const { projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi } = request.payload
          const businessDetails = { projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi }
          const sbiHtml = getSbiHtml(sbi, sbiError)

          return h.view(viewTemplate, createModel(errorList, businessDetails, sbiHtml, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: (request, h) => {
        const {
          projectName, businessName, numberEmployees, businessTurnover, sbi, results, inSbi
        } = request.payload
        if (inSbi === 'Yes' && sbi === '') {
          const sbiError = { text: 'Enter an SBI number, like 011115678', href: '#sbi' }
          const sbiHtml = getSbiHtml(sbi, sbiError)

          return h.view(viewTemplate, createModel([sbiError], request.payload, sbiHtml, getYarValue(request, 'checkDetails')))
        }

        setYarValue(request, 'businessDetails', {
          projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi
        })

        return results ? h.redirect(detailsPath) : h.redirect(nextPath)
      }
    }
  }
]
