const Joi = require('joi')
const { setLabelData, fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')

function createModel (errorMessageList, farmerDetails, backLink) {
  const { title, firstName, lastName } = farmerDetails

  const [titleError, firstNameError, lastNameError] = fetchListObjectItems(
    errorMessageList,
    ['titleError', 'firstNameError', 'lastNameError']
  )

  return {
    backLink,
    pageHeader: 'Farmer\'s details',
    formActionPage: '/farmer-details',
    selectTitle: {
      id: 'title',
      name: 'title',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Title (optional)',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      items: setLabelData(title, ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Other']),
      ...(titleError ? { errorMessage: { text: titleError } } : {})
    },
    inputFirstName: {
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'First name',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      ...(firstName ? { value: firstName } : {}),
      ...(firstNameError ? { errorMessage: { text: firstNameError } } : {})
    },
    inputLastName: {
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Last name',
        classes: 'govuk-label--m',
        isPageHeading: true
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
      const backLink = applying === 'Agent' ? '/agent-address-details' : '/applying'

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
          firstName: Joi.string().regex(/^[^0-9]+$/).required(),
          lastName: Joi.string().regex(/^[^0-9]+$/).required()
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
          const backLink = applying === 'Agent' ? '/agent-address-details' : '/applying'

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
