const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'abstraction-licence'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/SSSI`
const nextPath = `${urlPrefix}/project-summary`
const caveatPath = `${urlPrefix}/abstraction-required-condition`

function createModel (errorList, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},
    radios: {
      classes: '',
      idPrefix: 'abstractionLicence',
      name: 'abstractionLicence',
      fieldset: {
        legend: {
          text: 'Does the project need an abstraction licence or a variation of one?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(
        data,
        [LICENSE_NOT_NEEDED, LICENSE_SECURED, LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE]
      ),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const abstractionLicence = getYarValue(request, 'abstractionLicence')
      const data = abstractionLicence || null
      return h.view(viewTemplate, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          abstractionLicence: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          const errorObject = errorExtractor(err)

          errorList.push({ text: getErrorMessage(errorObject), href: '#abstractionLicence' })
          return h.view(viewTemplate, createModel(errorList)).takeover()
        }
      },
      handler: (request, h) => {
        const { abstractionLicence } = request.payload
        setYarValue(request, 'abstractionLicence', abstractionLicence)

        if (abstractionLicence === LICENSE_EXPECTED || abstractionLicence === LICENSE_WILL_NOT_HAVE) {
          return h.redirect(caveatPath)
        }

        return h.redirect(nextPath)
      }
    }
  }
]
