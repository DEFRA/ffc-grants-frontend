const Joi = require('joi')
const { setLabelData, findErrorList } = require('../helpers/helper-functions')

const CONSENT_MAIN = 'CONSENT_MAIN'
const CONSENT_OPTIONAL = 'CONSENT_OPTIONAL'

function createModel (consentMain, consentOptional, errorMessage) {
  return {
    backLink: '/farmer-address-details',
    consentMainData: {
      idPrefix: 'consentMain',
      name: 'consentMain',
      items: setLabelData(
        consentMain,
        [{
          value: CONSENT_MAIN,
          text: 'I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about the application.'
        }]
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    },
    consentOptionalData: {
      idPrefix: 'consentOptional',
      name: 'consentOptional',
      items: setLabelData(
        consentOptional,
        [{
          value: CONSENT_OPTIONAL,
          text: 'So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third party working for us, to contact you.'
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
      const consentMain = (request.yar.get('consentMain') && CONSENT_MAIN) || ''
      const consentOptional = (request.yar.get('consentOptional') && CONSENT_OPTIONAL) || ''

      return h.view('confirm', createModel(consentMain, consentOptional, null))
    }
  },
  {
    method: 'POST',
    path: '/confirm',
    options: {
      validate: {
        payload: Joi.object({
          consentMain: Joi.string().required(),
          consentOptional: Joi.string().allow('')
        }),
        failAction: (request, h, err) => {
          const [consentMainError] = findErrorList(err, ['consentMain'])

          let { consentMain, consentOptional } = request.payload
          consentMain = (consentMain && CONSENT_MAIN) || ''
          consentOptional = (consentMain && CONSENT_OPTIONAL) || ''

          return h.view(
            'confirm',
            createModel(consentMain, consentOptional, consentMainError)
          ).takeover()
        }
      }
    },
    handler: (request, h) => {
      request.yar.set('consentMain', true)
      request.yar.set('consentOptional', request.payload.consentOptional === CONSENT_OPTIONAL)
      return h.redirect('./confirmation')
    }
  }
]
