const Joi = require('joi')
const { setLabelData, fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { NAME_REGEX } = require('../helpers/regex-validation')

function createModel (errorMessageList, agentDetails) {
  const { title, firstName, lastName } = agentDetails

  const [titleError, firstNameError, lastNameError] = fetchListObjectItems(
    errorMessageList,
    ['titleError', 'firstNameError', 'lastNameError']
  )

  return {
    backLink: '/applying',
    pageHeader: 'Agent\'s details',
    formActionPage: '/agent-details',
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
    path: '/agent-details',
    handler: (request, h) => {
      let agentDetails = request.yar.get('agentDetails') || null

      if (!agentDetails) {
        agentDetails = {
          title: 'Other',
          firstName: null,
          lastName: null
        }
      }

      return h.view(
        'model-farmer-agent-details',
        createModel(null, agentDetails)
      )
    }
  },
  {
    method: 'POST',
    path: '/agent-details',
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
          const agentDetails = { title, firstName, lastName }

          return h.view('model-farmer-agent-details', createModel(errorMessageList, agentDetails)).takeover()
        }
      },
      handler: (request, h) => {
        const {
          title, firstName, lastName
        } = request.payload

        request.yar.set('agentDetails', {
          title, firstName, lastName
        })

        return h.redirect('./agent-contact-details')
      }
    }
  }
]
