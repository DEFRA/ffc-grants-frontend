const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { setYarValue, getYarValue } = require('../helpers/session')
const { LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'project-summary'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/abstraction-licence`
const nextPath = `${urlPrefix}/irrigated-crops`
const scorePath = `${urlPrefix}/score`
const caveatPath = `${urlPrefix}/abstraction-required-condition`

function createModel (errorList, data, backLink, hasScore) {
  return {
    backLink: backLink,
    formActionPage: currentPath,
    hasScore: hasScore,
    ...errorList ? { errorList } : {},
    checkboxes: {
      idPrefix: 'project',
      name: 'project',
      hint: {
        text: 'Select one or two options'
      },
      items: setLabelData(data, ['Change water source', 'Improve irrigation efficiency', 'Increase irrigation', 'Introduce irrigation', 'None of the above']),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
}

const getBackLink = (request) => {
  const abstractionLicence = getYarValue(request, 'abstractionLicence')
  return (abstractionLicence === LICENSE_EXPECTED || abstractionLicence === LICENSE_WILL_NOT_HAVE) ? caveatPath : previousPath
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const project = getYarValue(request, 'project')
      const data = project || null
      return h.view(viewTemplate, createModel(null, data, getBackLink(request), getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          project: Joi.any().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          const errorObject = errorExtractor(err)
          errorList.push({ text: getErrorMessage(errorObject), href: '#project' })
          gapiService.sendValidationDimension(request)
          return h.view(viewTemplate, createModel(errorList, null, getBackLink(request), getYarValue(request, 'current-score'))).takeover()
        }
      },
      handler: (request, h) => {
        let { project, results } = request.payload
        const errorList = []
        const hasScore = getYarValue(request, 'current-score')
        project = [project].flat()

        if (project.filter(option => option === 'None of the above').length > 0 && project.length > 1) {
          errorList.push({ text: 'If you select \'None of the above\', you cannot select another option', href: '#project' })
          return h.view(viewTemplate, createModel(errorList, project, getBackLink(request), hasScore))
        }

        if (project.length > 2) {
          errorList.push({ text: 'Select one or two options to describe the project impact', href: '#project' })
          return h.view(viewTemplate, createModel(errorList, project, getBackLink(request), hasScore))
        }

        setYarValue(request, 'project', project)
        return results ? h.redirect(scorePath) : h.redirect(nextPath)
      }
    }
  }
]
