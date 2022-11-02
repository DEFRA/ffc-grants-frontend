const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { isChecked, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'country'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/legal-status`
const nextPath = `${urlPrefix}/planning-permission`

const values = { valueOne: 'Yes', valueTwo: 'No' }

function createModel (errorList, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},

    radios: {
      idPrefix: 'inEngland',
      name: 'inEngland',
      classes: 'govuk-radios--inline',
      fieldset: {
        legend: {
          text: 'Is the planned project in England?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: 'The location of the project'
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          checked: isChecked(data, 'Yes')
        },
        {
          value: 'No',
          text: 'No',
          checked: isChecked(data, 'No')
        }
      ],
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    refTitle: 'Is the planned project in England?',
    backLink: currentPath,
    insetText: {
      text: 'Scotland, Wales and Northern Ireland have other grants available.'
    },
    messageContent: 'This grant is only for projects in England.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const inEngland = getYarValue(request, 'inEngland') || null
      return h.view(viewTemplate, createModel(null, inEngland))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          inEngland: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          const { inEngland } = request.payload
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#inEngland' })
          return h.view(viewTemplate, createModel(errorList, inEngland)).takeover()
        }
      },
      handler: async (request, h) => {
        const { inEngland } = request.payload

        setYarValue(request, 'inEngland', inEngland)
        if (inEngland === 'Yes') {
          return h.redirect(nextPath)
        }
        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
