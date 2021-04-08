const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: '/business-details',
    radios: {
      classes: '',
      idPrefix: 'applying',
      name: 'applying',
      fieldset: {
        legend: {
          text: 'Who is applying for this grant?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Farmer', 'Agent']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/applying',
    handler: (request, h) => {
      const applying = request.yar.get('applying')
      const data = applying || null
      return h.view('applying', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/applying',
    options: {
      validate: {
        payload: Joi.object({
          applying: Joi.string().required()
        }),
        failAction: (request, h) =>
          h
            .view('applying', createModel('Select who is applying for this grant', null))
            .takeover()
      },
      handler: (request, h) => {
        const { applying } = request.payload
        request.yar.set('applying', applying)

        if (applying === 'Agent') {
          return h.redirect('./agent-details')
        }
        return h.redirect('./confirm')
      }
    }
  }
]
