const Joi = require('joi')
const {
  setLabelData,
  errorExtractor,
  getErrorMessage
} = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const { LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')

function createModel (errorMessage, errorSummary, data, hasScore) {
  return {
    backLink: './SSSI',
    hasScore: hasScore,
    ...errorSummary ? { errorList: errorSummary } : {},
    checkboxes: {
      idPrefix: 'project',
      name: 'project',
      fieldset: {
        legend: {
          text: 'The project will:',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(data, ['Change water source', 'Improve irrigation efficiency', 'Increase irrigation', 'Introduce irrigation']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}
const getBackLink = (request) => {
  const abstractionLicence = getYarValue(request, 'abstractionLicence')
  return (
    abstractionLicence === LICENSE_EXPECTED ||
    abstractionLicence === LICENSE_WILL_NOT_HAVE
  )
    ? './abstraction-caveat'
    : './abstraction-licence'
}
module.exports = [
  {
    method: 'GET',
    path: '/project-details',
    handler: (request, h) => {
      const project = getYarValue(request, 'project')
      const data = project || null
      return h.view('project-details', createModel(null, null, data, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: '/project-details',
    options: {
      validate: {
        payload: Joi.object({
          project: Joi.any().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('project-details', createModel(errorMessage, null, null, getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { project, results } = request.payload
        const errorList = []
        const hasScore = getYarValue(request, 'current-score')
        project = [project].flat()

        if (project.length > 2) {
          errorList.push({ text: 'Select one or two options of what the project will achieve', href: '#project' })
          return h.view('project-details', createModel('Select one or two options', errorList, project, hasScore)).takeover()
        }

        setYarValue(request, 'project', project)
        return results ? h.redirect('./score') : h.redirect('./irrigated-crops')
      }
    }
  }
]
