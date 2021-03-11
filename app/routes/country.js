const Joi = require('joi')
let { isChecked } = require('../helpers/helper-functions')

const postCode = `<label class="govuk-label" for="project_postcode">
Enter Postcode</label><input class="govuk-input govuk-!-width-one-third" id="project_postcode" name="project_postcode">`

function createModel(errorMessage, data) {
  return {
    backLink: 'legal-status',
    radios: {
      idPrefix: 'inEngland',
      name: 'inEngland',
      fieldset: {
        legend: {
          text: 'Is the planned project in England?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        }
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          conditional: {
            html: postCode
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

function createModelNotEligible() {
  return {
    backLink: '/country',
    sentences: [
      'This is only for projects in England.',
      'Scotland, Wales and Northern Ireland have similar grants available.'
    ]
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/country',
    handler: (request, h) => {
      const inEngland = request.yar.get('inEngland')
      const data = !!inEngland ? inEngland : null
      return h.view('country', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/country',
    options: {
      validate: {
        payload: Joi.object({
          inEngland: Joi.string().required(),
          project_postcode: Joi.string().allow('')
        }),
        failAction: (request, h) => {
          console.log(request.payload, 'AAAAAAAA')
          console.log(typeof request.payload.inEngland, 'BBB')
          return h.view('country', createModel('You must select an option')).takeover()
        }
      },
      handler: (request, h) => {
        if (request.payload.inEngland === 'Yes') {
          if (request.payload.project_postcode.trim() === '') {
            return h.view('country', createModel('If yes, please type in postcode')).takeover()
          }
          request.yar.set('inEngland', request.payload.inEngland)
          return h.redirect('./project-details')
        }

        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
