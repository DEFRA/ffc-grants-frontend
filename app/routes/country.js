const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { isChecked, getPostCodeHtml, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const gapiService = require('../services/gapi-service')

const pageDetails = require('../helpers/page-details')('Q3')

function createModel (errorMessage, data, postcodeHtml) {
  return {
    backLink: pageDetails.previousPath,
    formActionPage: pageDetails.path,
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
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: pageDetails.path,
    messageContent: 'This grant is only for projects in England.<br/><br/>Scotland, Wales and Northern Ireland have other grants available.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: pageDetails.path,
    handler: (request, h) => {
      const inEngland = getYarValue(request, 'inEngland') || null
      const postcodeData = inEngland !== null ? getYarValue(request, 'projectPostcode') : null
      const postcodeHtml = getPostCodeHtml(postcodeData)

      return h.view(pageDetails.template, createModel(null, inEngland, postcodeHtml))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          inEngland: Joi.string().required(),
          projectPostcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().allow('')
        }),
        failAction: (request, h, err) => {
          const { inEngland, projectPostcode } = request.payload
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          const postcodeHtml = getPostCodeHtml(projectPostcode.toUpperCase(), inEngland ? errorMessage : null)

          return h.view(
            pageDetails.template,
            createModel(
              !inEngland ? errorMessage : null,
              inEngland,
              postcodeHtml
            )
          ).takeover()
        }
      },
      handler: async (request, h) => {
        const { inEngland, projectPostcode } = request.payload

        if (inEngland === 'Yes' && projectPostcode.trim() === '') {
          const postcodeHtml = getPostCodeHtml(projectPostcode.toUpperCase(), 'Enter a postcode, like AA1 1AA')
          return h.view(pageDetails.template, createModel(null, inEngland, postcodeHtml))
        }

        setYarValue(request, 'inEngland', inEngland)
        setYarValue(request, 'projectPostcode', projectPostcode.split(/(?=.{3}$)/).join(' ').toUpperCase())
        await gapiService.sendEligibilityEvent(request, inEngland === 'yes')

        if (inEngland === 'Yes') {
          return h.redirect(pageDetails.nextPath)
        }

        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
