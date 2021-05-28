const Joi = require('joi')
const {
  setLabelData,
  errorExtractor,
  getErrorMessage
} = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')

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

module.exports = [
  {
    method: 'GET',
    path: '/project-details',
    handler: (request, h) => {
      const project = getYarValue(request, 'project')
      const data = project || null
      const hasScore = getYarValue(request, 'current-score') || null

      return h.view('project-details', createModel(null, null, data, hasScore))
    }
  },
  {
    method: 'POST',
    path: '/project-details',
    options: {
      validate: {
        payload: Joi.object({
          project: Joi.any().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('project-details', createModel(errorMessage, null, null)).takeover()
        }
      },
      handler: (request, h) => {
        let { project } = request.payload
        const errorList = []
        project = [project].flat()

        if (project.length > 2) {
          errorList.push({ text: 'Select one or two options of what the project will achieve', href: '#project' })
          return h.view('project-details', createModel('Select one or two options', errorList, project)).takeover()
        }

        setYarValue(request, 'project', project)
        return h.redirect('./irrigated-crops')
      }
    }
  }
]
