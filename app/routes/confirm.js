const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const { urlPrefix, startPageUrl } = require('../config/server')

const viewTemplate = 'confirm'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/check-details`
const nextPath = `${urlPrefix}/confirmation`
const startPath = startPageUrl
const copyprovider = (key) => {
  const copy = {
    1: "Confirm and send",
    2: "I confirm that, to the best of my knowledge, the details I have provided are correct.",
    3: "I understand the project’s eligibility and score is based on the answers I provided.",
    4: "I am aware that the information I submit will be:",
    5: "checked by the RPA",
    6: "shared with the Environment Agency so that they can check the details of my planned project",
    7: "I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about my application.",
    8: "So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.",
    9: "(Optional) I consent to being contacted about improving services.",
    10: "You can only submit your details once",
    11: "Confirm and send",
  }
  return copy[ key ];
}

const CONSENT_OPTIONAL = 'CONSENT_OPTIONAL'

function createModel (consentOptional, errorMessage) {
  return {
    backLink: previousPath,
    copyprovider,
    formActionPage: currentPath,
    consentOptionalData: {
      idPrefix: 'consentOptional',
      name: 'consentOptional',
      items: setLabelData(
        consentOptional,
        [{
          value: CONSENT_OPTIONAL,
          text: copyprovider(9),
        }]
      )
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      if (!getYarValue(request, 'farmerDetails') || !getYarValue(request, 'checkDetails')) {
        return h.redirect(startPath)
      }
      const consentOptional = (getYarValue(request, 'consentOptional') && CONSENT_OPTIONAL) || ''

      return h.view(viewTemplate, createModel(consentOptional, null))
    }
  },
  {
    method: 'POST',
    path: currentPath,
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
      return h.redirect(nextPath)
    }
  }
]
