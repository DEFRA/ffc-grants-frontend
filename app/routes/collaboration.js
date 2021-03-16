const Joi = require('joi')
let { setLabelData } = require('../helpers/helper-functions')

function createModel(errorMessage, data) {
  return {
    backLink: '/productivity',
    radios: {
      classes: '',
      idPrefix: 'collaboration',
      name: 'collaboration',
      fieldset: {
        legend: {
          text: 'Will water be supplied to other farms?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text:
          'If you intend to supply water via a water sharing agreement as a result of this project.'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/collaboration',
    handler: (request, h) => {
      const collaboration = request.yar.get('collaboration')
      const data = !!collaboration ? collaboration : null
      return h.view('collaboration', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/collaboration',
    options: {
      validate: {
        payload: Joi.object({
          collaboration: Joi.string().required()
        }),
        failAction: (request, h) =>
          h
            .view('collaboration', createModel('Please select an option'))
            .takeover()
      },
      handler: (request, h) => {
        request.yar.set('collaboration', request.payload.collaboration)
        return h.redirect('./answers')
      }
    }
  }
]
