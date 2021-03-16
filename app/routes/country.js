const Joi = require('joi')
let { isChecked } = require('../helpers/helper-functions')

function createModel(errorMessage, data, postcodeHtml) {
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
            html: postcodeHtml
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

function getPostCodeHtml(postcodeData) {
  let postcode = postcodeData && postcodeData !== null ? postcodeData : ' ' 
  return `<label class="govuk-label" for="project_postcode">
  Enter Postcode</label><input class="govuk-input govuk-!-width-one-third" id="project_postcode" name="project_postcode" value=${postcode}>`
  
}

module.exports = [
  {
    method: 'GET',
    path: '/country',
    handler: (request, h) => {
      const inEngland = request.yar.get('inEngland') || null
      const postcodeData = inEngland !== null ? request.yar.get('project_postcode') : null
      const postcodeHtml = getPostCodeHtml(postcodeData)

      return h.view('country', createModel(null, inEngland, postcodeHtml))
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
        failAction: (request, h) => h.view('country', createModel('You must select an option',null, getPostCodeHtml(''))).takeover()
      },
      handler: (request, h) => {
        const { inEngland, project_postcode } = request.payload
        if (inEngland === 'Yes' && project_postcode.trim() === '') {
          return h.view('country', createModel('If yes, please type in postcode', inEngland, getPostCodeHtml(project_postcode))).takeover()
        }

        request.yar.set('inEngland', inEngland)
        request.yar.set('project_postcode', project_postcode)
        return inEngland === 'Yes' ? h.redirect('./project-details') : h.view('not-eligible', createModelNotEligible())

      }
    }
  }
]
