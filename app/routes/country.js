const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { isChecked, getPostCodeHtml, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'country'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/legal-status`
const nextPath = `${urlPrefix}/planning-permission`

function createModel (errorList, data, postcodeHtml) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},

    radios: {
      idPrefix: 'inEngland',
      name: 'inEngland',
      fieldset: {
        legend: {
          text: 'Is the planned project in England?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          conditional: {
            html: postcodeHtml
          },
          checked: isChecked(data, 'Yes')
        },
        {
          value: 'No',
          text: 'No',
          checked: isChecked(data, 'No')
        }
      ],
      ...(errorList && !postcodeHtml.includes('Error:') ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    refTitle: 'Project location',
    backLink: currentPath,
    insertText: {
      text: 'Scotland, Wales and Northern Ireland have other grants available.'
    },
    messageContent: 'This grant is only for projects in England.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const inEngland = getYarValue(request, 'inEngland') || null
      const postcodeData = inEngland !== null ? getYarValue(request, 'projectPostcode') : null
      const postcodeHtml = getPostCodeHtml(postcodeData)

      return h.view(viewTemplate, createModel(null, inEngland, postcodeHtml))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          inEngland: Joi.string().required(),
          projectPostcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().allow('')
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorList = []
          const { inEngland, projectPostcode } = request.payload
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#inEngland' })

          const postcodeHtml = getPostCodeHtml(projectPostcode.toUpperCase(), inEngland ? errorList : null)

          return h.view(viewTemplate, createModel(!inEngland ? errorList : null, inEngland, postcodeHtml)).takeover()
        }
      },
      handler: async (request, h) => {
        const errorList = []
        const { inEngland, projectPostcode } = request.payload
        errorList.push({ text: 'Enter a postcode, like AA1 1AA', href: '#projectPostcode' })

        if (inEngland === 'Yes' && projectPostcode.trim() === '') {
          const postcodeHtml = getPostCodeHtml(projectPostcode.toUpperCase(), errorList)
          return h.view(viewTemplate, createModel(errorList, inEngland, postcodeHtml))
        }

        setYarValue(request, 'inEngland', inEngland)
        setYarValue(request, 'projectPostcode', projectPostcode.split(/(?=.{3}$)/).join(' ').toUpperCase())
        await gapiService.sendEligibilityEvent(request, inEngland === 'yes')

        if (inEngland === 'Yes') {
          return h.redirect(nextPath)
        }

        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
