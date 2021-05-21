const Joi = require('joi')
const { setLabelData, fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { NAME_REGEX } = require('../helpers/regex-validation')
const gapiService = require('../services/gapi-service')

function createModel (errorMessageList, farmerDetails, backLink) {
  const { title, firstName, lastName } = farmerDetails

  const [titleError, firstNameError, lastNameError] = fetchListObjectItems(
    errorMessageList,
    ['titleError', 'firstNameError', 'lastNameError']
  )

  return {
    backLink,
    pageId: 'Farmer',
    pageHeader: 'Farmer\'s details',
    formActionPage: './farmer-details',
    selectTitle: {
      id: 'title',
      name: 'title',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Title (optional)'
      },
      items: setLabelData(title, [{ value: 'Other', text: 'Select an option' }, 'Mr', 'Mrs', 'Ms', 'Miss', 'Dr']),
      ...(titleError ? { errorMessage: { text: titleError } } : {})
    },
    inputFirstName: {
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'First name'
      },
      ...(firstName ? { value: firstName } : {}),
      ...(firstNameError ? { errorMessage: { text: firstNameError } } : {})
    },
    inputLastName: {
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Last name'
      },
      ...(lastName ? { value: lastName } : {}),
      ...(lastNameError ? { errorMessage: { text: lastNameError } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/farmer-details',
    handler: (request, h) => {
      let farmerDetails = request.yar.get('farmerDetails') || null

      if (!farmerDetails) {
        farmerDetails = {
          title: 'Other',
          firstName: null,
          lastName: null
        }
      }

      const applying = request.yar.get('applying')
      const backLink = applying === 'Agent' ? './agent-address-details' : './applying'

      gapiService.sendDimensionOrMetric(request, {
        category: gapiService.categories.AGENTFORMER,
        action: gapiService.actions,
        dimensionOrMetric: gapiService.dimensions.AGENTFORMER,
        value: 'Former'
      })
      return h.view(
        'model-farmer-agent-details',
        createModel(null, farmerDetails, backLink)
      )
    }
  },
  {
    method: 'POST',
    path: '/farmer-details',
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          title: Joi.any(),
          firstName: Joi.string().regex(NAME_REGEX).required(),
          lastName: Joi.string().regex(NAME_REGEX).required()
        }),
        failAction: (request, h, err) => {
          const [
            titleError, firstNameError, lastNameError
          ] = findErrorList(err, ['title', 'firstName', 'lastName'])

          const errorMessageList = {
            titleError, firstNameError, lastNameError
          }

          const { title, firstName, lastName } = request.payload
          const farmerDetails = { title, firstName, lastName }

          const applying = request.yar.get('applying')
          const backLink = applying === 'Agent' ? './agent-address-details' : './applying'

          return h.view('model-farmer-agent-details', createModel(errorMessageList, farmerDetails, backLink)).takeover()
        }
      },
      handler: (request, h) => {
        const {
          title, firstName, lastName
        } = request.payload

        request.yar.set('farmerDetails', {
          title, firstName, lastName
        })

        return h.redirect('./farmer-contact-details')
      }
    }
  }
]
