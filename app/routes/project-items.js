const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')

const viewTemplate = 'project-items'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/project-cost`
const tenancyLengthPath = `${urlPrefix}/tenancy-length`
const tenancyPath = `${urlPrefix}/tenancy`

function createModel (errorList, backLink, projectInfrastucture, projectEquipment, projectTechnology) {
  return {
    backLink,
    formActionLink: currentPath,
    ...errorList ? { errorList } : {},
    checkboxesInfrastucture: {
      idPrefix: 'projectInfrastucture',
      name: 'projectInfrastucture',
      fieldset: {
        legend: {
          text: 'Reservoir construction and infrastructure',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(
        projectInfrastucture,
        ['Construction of reservoir walls',
          'Overflow/spillway',
          'Synthetic liner',
          'Abstraction point including pump',
          'Engineer fees (construction engineers only)',
          'Fencing for synthetically lined reservoir',
          'Filtration equipment',
          'Irrigation pumps and controls',
          'Pipework to fill the reservoir',
          'Pumphouse',
          'Underground water distribution main and hydrants',
          'Electricity installation for pumphouse',
          'Water meter'
        ]
      ),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
    },
    checkboxesEquipment: {
      idPrefix: 'projectEquipment',
      name: 'projectEquipment',
      fieldset: {
        legend: {
          text: 'Irrigation equipment',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(
        projectEquipment,
        ['Boom',
          'Trickle',
          'Ebb and flow',
          'Capillary bed',
          'Sprinklers',
          'Mist'
        ]
      ),
      ...(errorList ? { errorMessage: { text: null } } : {})
    },
    checkboxesTechnology: {
      idPrefix: 'projectTechnology',
      name: 'projectTechnology',
      fieldset: {
        legend: {
          text: 'Technology',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(
        projectTechnology,
        ['Software to monitor soil moisture levels and schedule irrigation',
          'Software and sensors to optimise water application'
        ]
      ),
      ...(errorList ? { errorMessage: { text: null } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const landOwnership = getYarValue(request, 'landOwnership') || null
      const backUrl = landOwnership === 'No' ? tenancyLengthPath : tenancyPath

      const projectInfrastucture = getYarValue(request, 'projectInfrastucture') || null
      const projectEquipment = getYarValue(request, 'projectEquipment') || null
      const projectTechnology = getYarValue(request, 'projectTechnology') || null

      return h.view(viewTemplate, createModel(null, backUrl, projectInfrastucture, projectEquipment, projectTechnology))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          projectInfrastucture: Joi.any(),
          projectEquipment: Joi.any(),
          projectTechnology: Joi.any()
        }),
        failAction: (request, h) => {
          const landOwnership = getYarValue(request, 'landOwnership') || null
          const backUrl = landOwnership === 'No' ? tenancyLengthPath : tenancyPath
          gapiService.sendValidationDimension(request)
          const errorList = [{ text: 'Select all the items your project needs', href: '#projectInfrastucture' }]
          return h.view(viewTemplate, createModel(errorList, backUrl, null)).takeover()
        }
      },
      handler: (request, h) => {
        const landOwnership = getYarValue(request, 'landOwnership') || null
        const backUrl = landOwnership === 'No' ? tenancyLengthPath : tenancyPath
        const errorList = [{ text: 'Select all the items your project needs', href: '#projectInfrastucture' }]
        let {
          projectInfrastucture,
          projectEquipment,
          projectTechnology
        } = request.payload

        if (!projectInfrastucture && !projectEquipment && !projectTechnology) {
          return h.view(
            viewTemplate,
            createModel(
              errorList,
              backUrl,
              projectInfrastucture,
              projectEquipment,
              projectTechnology
            )
          )
        }

        projectInfrastucture = [projectInfrastucture].flat()
        projectEquipment = [projectEquipment].flat()
        projectTechnology = [projectTechnology].flat()

        setYarValue(request, 'projectInfrastucture', projectInfrastucture)
        setYarValue(request, 'projectEquipment', projectEquipment)
        setYarValue(request, 'projectTechnology', projectTechnology)

        const projectInfrastuctureList = projectInfrastucture.filter((x) => !!x)
        const projectEquipmentList = projectEquipment.filter((x) => !!x)
        const projectTechnologyList = projectTechnology.filter((x) => !!x)

        const projectItemsList = [...projectInfrastuctureList, ...projectEquipmentList, ...projectTechnologyList]

        setYarValue(request, 'projectItemsList', projectItemsList)

        return h.redirect(nextPath)
      }
    }
  }
]
