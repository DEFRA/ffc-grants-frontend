const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')

const CONSENT_OPTIONAL = 'CONSENT_OPTIONAL'

function createModel (consentOptional, errorMessage) {
  return {
    backLink: './farmer-address-details',
    consentOptionalData: {
      idPrefix: 'consentOptional',
      name: 'consentOptional',
      items: setLabelData(
        consentOptional,
        [{
          value: CONSENT_OPTIONAL,
          text: '(Optional) So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third party working for us, to contact you.'
        }]
      )
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/confirm',
    handler: (request, h) => {
      const refererURL = request?.headers?.referer?.split('/').pop()

      if (!getYarValue(request, 'farmerAddressDetails') || refererURL !== 'farmer-address-details') {
        return h.redirect('./start')
      }
      const consentOptional = (getYarValue(request, 'consentOptional') && CONSENT_OPTIONAL) || ''

      return h.view('confirm', createModel(consentOptional, null))
    }
  },
  {
    method: 'POST',
    path: '/confirm',
    options: {
      validate: {
        payload: Joi.object({
          consentOptional: Joi.string().allow('')
        })
      }
    },
    handler: (request, h) => {
      setYarValue(request, 'consentMain', true)
      setYarValue(request, 'consentOptional', request.payload.consentOptional === CONSENT_OPTIONAL)
      return h.redirect('./confirmation')
    }
  }
]
