const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const {
  setLabelData,
  errorExtractor,
  getErrorMessage
} = require('../helpers/helper-functions')

const pageDetails = require('../helpers/page-details')('Q15')

const createModel = (errorMessage, data, hasScore) => ({
  backLink: pageDetails.previousPath,
  formActionPage: pageDetails.path,
  hasScore: hasScore,
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
    path: pageDetails.path,
    handler: (request, h) => {
      const irrigatedCrops = getYarValue(request, 'irrigatedCrops')
      const data = irrigatedCrops || null
      return h.view(pageDetails.template, createModel(null, data, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          irrigatedCrops: Joi.string().required(),
          results: Joi.any()

        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(pageDetails.template, createModel(errorMessage, null, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        const results = request.payload.results
        setYarValue(request, 'irrigatedCrops', request.payload.irrigatedCrops)
        return results ? h.redirect(`${pageDetails.pathPrefix}/score`) : h.redirect(pageDetails.nextPath)
      }
    }
  }
]
