const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { getErrorList } = require('../helpers/helper-functions')
const { NAME_REGEX, BUSINESSNAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const { getDetailsInput } = require('../helpers/detailsInputs')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'model-farmer-agent-details'
const currentPath = `${urlPrefix}/agent-details`
const previousPath = `${urlPrefix}/applying`
const nextPath = `${urlPrefix}/farmer-details`
const detailsPath = `${urlPrefix}/check-details`

function createModel (errorList, agentDetails, hasDetails) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    pageId: 'Agent',
    pageHeader: 'Agent\'s details',
    checkDetail: hasDetails,
    ...errorList ? { errorList } : {},
    ...getDetailsInput(agentDetails, errorList)
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: async (request, h) => {
      let agentDetails = getYarValue(request, 'agentDetails') || null
      if (!agentDetails) {
        agentDetails = {
          firstName: null,
          lastName: null,
          businessName: null,
          email: null,
          emailConfirm: null,
          mobile: null,
          landline: null,
          address1: null,
          address2: null,
          town: null,
          county: null,
          postcode: null
        }
      }
      return h.view(viewTemplate, createModel(null, agentDetails, getYarValue(request, 'checkDetails')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          lastName: Joi.string().regex(NAME_REGEX).required(),
          email: Joi.string().email().required(),
          emailConfirm: Joi.string().email().required(),
          businessName: Joi.string().regex(BUSINESSNAME_REGEX).max(100).required(),
          firstName: Joi.string().regex(NAME_REGEX).required(),
          results: Joi.any(),
          postcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required(),
          county: Joi.string().required(),
          town: Joi.string().allow(''),
          address1: Joi.string().required(),
          address2: Joi.string().allow(''),
          landline: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          mobile: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
        }),
        failAction: (request, h, err) => {
          const phoneErrors = []
          if (request.payload.landline === '' && request.payload.mobile === '') {
            phoneErrors.push({ text: 'Enter your mobile number', href: '#mobile' })
            phoneErrors.push({ text: 'Enter your landline number', href: '#landline' })
          }

          const errorList = getErrorList([ 'firstName', 'lastName', 'businessName', 'email', 'emailConfirm', 'mobile', 'landline', 'address1', 'address2', 'town', 'county', 'postcode'], err, phoneErrors)

          const { firstName, lastName, businessName, email, emailConfirm, mobile, landline, address1, address2, town, county, postcode } = request.payload
          const agentDetails = { firstName, lastName, businessName, email, emailConfirm, mobile, landline, address1, address2, town, county, postcode }
          return h.view(viewTemplate, createModel(errorList, agentDetails, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: (request, h) => {
        const {
          firstName, lastName, businessName, email, mobile, emailConfirm, landline, address1, address2, town, county, postcode, results
        } = request.payload

        const phoneErrors = [
          { text: 'Enter your mobile number', href: '#mobile' },
          { text: 'Enter your landline number', href: '#landline' }
        ]

        if (!landline && !mobile) {
          return h.view(viewTemplate, createModel(phoneErrors, {
            firstName, lastName, businessName, email, emailConfirm, mobile, landline, address1, address2, town, county, postcode
          }, getYarValue(request, 'checkDetails'))).takeover()
        }

        setYarValue(request, 'agentDetails', {
          firstName, lastName, businessName, email, emailConfirm, mobile, landline, address1, address2, town, county, postcode: postcode.split(/(?=.{3}$)/).join(' ').toUpperCase()
        })

        return results ? h.redirect(detailsPath) : h.redirect(nextPath)
      }
    }
  }
]
