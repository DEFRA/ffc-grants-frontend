const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData } = require('../helpers/helper-functions')

const pageDetails = require('../helpers/page-details')('Q7')

function createModel (errorMessage, backLink, projectInfrastucture, projectEquipment, projectTechnology) {
  return {
    backLink,
    formActionLink: pageDetails.path,
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
        ['Construction of dam walls',
          'Construction of reservoir',
          'Overflow/spillway',
          'Synthetic liner',
          'Abstraction point including pump',
          'Engineer fees (construction engineers only)',
          'Fencing for synthetically lined reservoir',
          'Filtration equipment',
          'Irrigation pump(s) and controls',
          'Pipework to fill the reservoir',
          'Pumphouse',
          'Underground water distribution main and hydrants',
          'Electricity installation for pumphouse',
          'Water meter'
        ]
      ),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
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
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
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
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: pageDetails.path,
    handler: (request, h) => {
      const landOwnership = getYarValue(request, 'landOwnership') || null
      const backUrl = landOwnership === 'No'
        ? `${pageDetails.pathPrefix}/tenancy-length`
        : `${pageDetails.pathPrefix}/tenancy`

      const projectInfrastucture = getYarValue(request, 'projectInfrastucture') || null
      const projectEquipment = getYarValue(request, 'projectEquipment') || null
      const projectTechnology = getYarValue(request, 'projectTechnology') || null

      return h.view(
        pageDetails.template,
        createModel(null, backUrl, projectInfrastucture, projectEquipment, projectTechnology)
      )
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          projectInfrastucture: Joi.any(),
          projectEquipment: Joi.any(),
          projectTechnology: Joi.any()
        }),
        failAction: (request, h) => {
          const landOwnership = getYarValue(request, 'landOwnership') || null
          const backUrl = landOwnership === 'No'
            ? `${pageDetails.pathPrefix}/answers`
            : `${pageDetails.pathPrefix}/tenancy`

          return h.view(pageDetails.template, createModel('Please select an option', backUrl, null)).takeover()
        }
      },
      handler: (request, h) => {
        const landOwnership = getYarValue(request, 'landOwnership') || null
        const backUrl = landOwnership === 'No'
          ? `${pageDetails.pathPrefix}/tenancy-length`
          : `${pageDetails.pathPrefix}/tenancy`

        let {
          projectInfrastucture,
          projectEquipment,
          projectTechnology
        } = request.payload

        if (!projectInfrastucture && !projectEquipment && !projectTechnology) {
          return h.view(
            pageDetails.template,
            createModel(
              'Select all the items your project needs',
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

        return h.redirect(pageDetails.nextPath)
      }
    }
  }
]
