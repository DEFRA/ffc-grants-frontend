const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')
function createModel (errorMessage) {
  return {
    backLink: '/farmer-address-details',
    checkboxConfirm: {
      idPrefix: 'iConfirm',
      name: 'iConfirm',
      items: setLabelData(
        '',
        [
          'I confirm'
        ]
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/confirm',
    handler: (request, h) => {
      return h.view('confirm', createModel())
    }
  },
  {
    method: 'POST',
    path: '/confirm',
    options: {
      validate: {
        payload: Joi.object({
          iConfirm: Joi.string().valid('I confirm').required()
        }),
        failAction: (request, h) => {
          return h.view('confirm', createModel('Please confirm consent.')).takeover()
        }
      }
    },
    handler: (request, h) => {
      request.yar.set('consentGiven', true)
      return h.redirect('./confirmation')
    }
  }
]
