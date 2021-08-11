const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'collaboration'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/productivity`
const nextPath = `${urlPrefix}/score`

function createModel (errorList, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},
    radios: {
      classes: 'govuk-radios--inline',
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
          'For example, if you intend to supply water via a water sharing agreement as a result of this project.'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const collaboration = getYarValue(request, 'collaboration')
      const data = collaboration || null
      return h.view(viewTemplate, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          collaboration: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#collaboration' })
          return h.view(viewTemplate, createModel(errorList)).takeover()
        }
      },
      handler: (request, h) => {
        setYarValue(request, 'collaboration', request.payload.collaboration)
        return h.redirect(nextPath)
      }
    }
  }
]
