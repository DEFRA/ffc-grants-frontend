const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')

function createModel (errorMessage, errorSummary, data) {
  return {
    backLink: '/irrigation-systems',
    ...(errorSummary ? { errorText: errorSummary } : {}),
    checkboxes: {
      idPrefix: 'productivity',
      name: 'productivity',
      fieldset: {
        legend: {
          text: 'How will the project improve productivity?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: 'Productivity is about how much is produced relative to inputs (eg increased yield for the same inputs or the same yield with lower inputs).'
      },
      items: setLabelData(data, ['Introduce or expand high value crops', 'Introduce or expand protected crops', 'Increased yield per hectare', 'Improved quality', 'Maintain productivity']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/productivity',
    handler: (request, h) => {
      const productivity = request.yar.get('productivity')
      const data = productivity || null
      return h.view('productivity', createModel(null, null, data))
    }
  },
  {
    method: 'POST',
    path: '/productivity',
    options: {
      validate: {
        payload: Joi.object({
          productivity: Joi.any().required()
        }),
        failAction: (request, h) =>
          h.view('productivity', createModel('Please select an option', null, null)).takeover()
      },
      handler: (request, h) => {
        let { productivity } = request.payload
        productivity = [productivity].flat()
        if (productivity.length > 2) {
          return h.view('productivity', createModel('Only one or two selections are allowed', 'Only one or two selections are allowed', null)).takeover()
        }
        request.yar.set('productivity', productivity)
        return h.redirect('./collaboration')
      }
    }
  }
]
