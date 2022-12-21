const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { getErrorList } = require('../helpers/helper-functions')
const { NAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX, TOWN_REGEX, ADDRESS_REGEX } = require('../helpers/regex-validation')
const { getDetailsInput } = require('../helpers/detailsInputs')
const gapiService = require('../services/gapi-service')

const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'model-farmer-agent-details'
const currentPath = `${urlPrefix}/applicant-details`
const nextPath = `${urlPrefix}/check-details`
const agentDetailsPath = `${urlPrefix}/agent-details`
const applyingPath = `${urlPrefix}/applying`

function createModel (errorList, farmerDetails, backLink, hasDetails) {
  return {
    backLink,
    pageId: 'Farmer',
    formActionPage: currentPath,
    pageHeader: 'Applicant’s details',
    checkDetail: hasDetails,
    ...errorList ? { errorList } : {},
    ...getDetailsInput(farmerDetails, errorList),
    hintText: 'Enter the farmer and farm business details'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: async (request, h) => {
      let farmerDetails = getYarValue(request, 'farmerDetails') || null

      if (farmerDetails == null) {
        farmerDetails = {
          firstName: null,
          lastName: null,
          email: null,
          emailConfirm: null,
          mobile: null,
          landline: null,
          address1: null,
          address2: null,
          town: null,
          county: null,
          projectPostcode: null,
          businessPostcode: null
        }
      }

      const applying = getYarValue(request, 'applying')
      await gapiService.sendDimensionOrMetric(request, {
        dimensionOrMetric: gapiService.dimensions.AGENTFORMER,
        value: applying
      })
      const backLink = applying === 'Agent' ? agentDetailsPath : applyingPath
      return h.view(viewTemplate, createModel(null, farmerDetails, backLink, getYarValue(request, 'checkDetails')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          firstName: Joi.string().regex(NAME_REGEX).required(),
          lastName: Joi.string().regex(NAME_REGEX).required(),
          email: Joi.string().email().required(),
          emailConfirm: Joi.string().email().required(),
          mobile: Joi.string().regex(PHONE_REGEX).replace(/\s/g, '').min(10).allow(''),
          landline: Joi.string().regex(PHONE_REGEX).replace(/\s/g, '').min(10).allow(''),
          address1: Joi.string().regex(ADDRESS_REGEX).required(),
          address2: Joi.string().regex(ADDRESS_REGEX).allow(''),
          town: Joi.string().regex(TOWN_REGEX).required(),
          county: Joi.string().required(),
          projectPostcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required(),
          businessPostcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required(),
          results: Joi.any()
        }),
        failAction: async (request, h, err) => {
          const comparisonErrors = []
          if (request.payload.landline === '' && request.payload.mobile === '') {
            comparisonErrors.push({ text: 'Enter a mobile number (If you do not have a mobile, enter your landline number)', href: '#mobile' })
            comparisonErrors.push({ text: 'Enter a landline number (If you do not have a landline, enter your mobile number)', href: '#landline' })
          }

          if (request.payload.emailConfirm !== request.payload.email) {
            comparisonErrors.push({ text: 'Enter an email address that matches', href: '#emailConfirm' })
          }

          const errorList = getErrorList(['firstName', 'lastName', 'email', 'emailConfirm', 'mobile', 'landline', 'address1', 'address2', 'town', 'county', 'projectPostcode', 'businessPostcode'], err, comparisonErrors)
          const { firstName, lastName, email, emailConfirm, mobile, landline, address1, address2, town, county, projectPostcode, businessPostcode } = request.payload
          const farmerDetails = { firstName, lastName, email, emailConfirm, mobile, landline, address1, address2, town, county, projectPostcode, businessPostcode }
          const applying = getYarValue(request, 'applying')
          const backLink = applying === 'Agent' ? agentDetailsPath : applyingPath
          await request.ga.pageView()

          return h.view(viewTemplate, createModel(errorList, farmerDetails, backLink, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: async (request, h) => {
        const {
          firstName, lastName, email, emailConfirm, mobile, landline, address1, address2, town, county, projectPostcode, businessPostcode
        } = request.payload

        const phoneErrors = [
          { text: 'Enter a mobile number (If you do not have a mobile, enter your landline number)', href: '#mobile' },
          { text: 'Enter a landline number (If you do not have a landline, enter your mobile number)', href: '#landline' }
        ]

        if (!landline && !mobile) {
          await request.ga.pageView()
          return h.view(viewTemplate, createModel(phoneErrors, {
            firstName, lastName, email, emailConfirm, mobile, landline, address1, address2, town, county, projectPostcode, businessPostcode
          }, getYarValue(request, 'checkDetails'))).takeover()
        }

        if (emailConfirm !== email) {
          const emailError = [{ text: 'Enter an email address that matches', href: '#emailConfirm' }]
          await request.ga.pageView()
          return h.view(viewTemplate, createModel(emailError, {
            firstName, lastName, email, emailConfirm, mobile, landline, address1, address2, town, county, projectPostcode, businessPostcode
          }, getYarValue(request, 'checkDetails'))).takeover()
        }

        setYarValue(request, 'farmerDetails', {
          firstName, lastName, email, emailConfirm, mobile, landline, address1, address2, town, county, projectPostcode: projectPostcode.split(/(?=.{3}$)/).join(' ').toUpperCase(),  businessPostcode: businessPostcode.split(/(?=.{3}$)/).join(' ').toUpperCase()
        })

        return h.redirect(nextPath)
      }
    }
  }
]