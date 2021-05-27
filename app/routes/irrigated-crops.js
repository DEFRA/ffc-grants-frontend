const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const {
  setLabelData,
  errorExtractor,
  getErrorMessage
} = require('../helpers/helper-functions')

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
      { text: 'Field-scale crops (for example potatoes, onions, carrots)', value: 'Field-scale crops' },
      { text: 'Protected cropping (for example glasshouse or poly tunnel)', value: 'Protected cropping' },
      { text: 'Fruit (for example top fruit, bush fruit)', value: 'Fruit' }
    ]),

    ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
  }

})

module.exports = [
  {
    method: 'GET',
    path: '/irrigated-crops',
    handler: (request, h) => {
      const irrigatedCrops = getYarValue(request, 'irrigatedCrops')
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
        setYarValue(request, 'irrigatedCrops', request.payload.irrigatedCrops)
        return h.redirect('./irrigated-land')
      }
    }
  }
]
