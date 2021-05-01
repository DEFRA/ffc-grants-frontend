const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

const createModel = (errorMessage, data) => ({

  backLink: './project-details',
  radios: {
    classes: '',
    idPrefix: 'irrigatedCrops',
    name: 'irrigatedCrops',
    fieldset: {
      legend: {
        text: 'What main crops will be irrigated?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(data, [
      { text: 'Field-scale crops (eg potatoes, onions, carrots)', value: 'Field-scale crops' },
      { text: 'Protected cropping (eg glasshouse or poly tunnel)', value: 'Protected cropping' },
      { text: 'Fruit (eg fruit, bush fruit)', value: 'Fruit' }
    ]),

    ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
  }

})

module.exports = [
  {
    method: 'GET',
    path: '/irrigated-crops',
    handler: (request, h) => {
      const irrigatedCrops = request.yar.get('irrigatedCrops')
      const data = irrigatedCrops || null
      return h.view('irrigated-crops', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/irrigated-crops',
    options: {
      validate: {
        payload: Joi.object({
          irrigatedCrops: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('irrigated-crops', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('irrigatedCrops', request.payload.irrigatedCrops)
        return h.redirect('./irrigated-land')
      }
    }
  }
]
