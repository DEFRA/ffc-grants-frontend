const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { POSTCODE_REGEX } = require('../helpers/regex-validation')
const { LIST_COUNTIES } = require('../helpers/all-counties')

function createModel (errorMessageList, agentAddressDetails) {
  const { address1, address2, town, county, postcode } = agentAddressDetails

  const [address1Error, townError, countyError, postcodeError] = fetchListObjectItems(
    errorMessageList,
    ['address1Error', 'townError', 'countyError', 'postcodeError']
  )

  return {
    backLink: './agent-contact-details',
    pageHeader: 'Agent\'s address details',
    formActionPage: './agent-address-details',
    inputAddress1: {
      id: 'address1',
      name: 'address1',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Address 1'
      },
      ...(address1 ? { value: address1 } : {}),
      ...(address1Error ? { errorMessage: { text: address1Error } } : {})
    },
    inputAddress2: {
      id: 'address2',
      name: 'address2',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Address 2 (optional)'
      },
      ...(address2 ? { value: address2 } : {})
    },
    inputTown: {
      id: 'town',
      name: 'town',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Town'
      },
      ...(town ? { value: town } : {}),
      ...(townError ? { errorMessage: { text: townError } } : {})
    },
    selectCounty: {
      id: 'county',
      name: 'county',
      classes: 'govuk-input--width-10',
      label: {
        text: 'County'
      },
      items: setLabelData(county, [
        { text: 'Select an option', value: null },
        ...LIST_COUNTIES
      ]),
      ...(countyError ? { errorMessage: { text: countyError } } : {})
    },
    inputPostcode: {
      id: 'postcode',
      name: 'postcode',
      classes: 'govuk-input--width-5',
      label: {
        text: 'Postcode'
      },
      ...(postcode ? { value: postcode } : {}),
      ...(postcodeError ? { errorMessage: { text: postcodeError } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/agent-address-details',
    handler: (request, h) => {
      let agentAddressDetails = getYarValue(request, 'agentAddressDetails') || null
      if (!agentAddressDetails) {
        agentAddressDetails = {
          address1: null,
          address2: null,
          town: null,
          county: null,
          postcode: null
        }
      }

      return h.view(
        'model-farmer-agent-address-details',
        createModel(null, agentAddressDetails)
      )
    }
  },
  {
    method: 'POST',
    path: '/agent-address-details',
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          address1: Joi.string().required(),
          address2: Joi.string().allow(''),
          town: Joi.string().required(),
          county: Joi.string().required(),
          postcode: Joi.string().regex(POSTCODE_REGEX).trim().required()
        }),
        failAction: (request, h, err) => {
          const [
            address1Error, townError, countyError, postcodeError
          ] = findErrorList(err, ['address1', 'town', 'county', 'postcode'])

          const errorMessageList = {
            address1Error, townError, countyError, postcodeError
          }

          const { address1, address2, town, county, postcode } = request.payload
          const agentAddressDetails = { address1, address2, town, county, postcode: postcode.toUpperCase() }

          return h.view('model-farmer-agent-address-details', createModel(errorMessageList, agentAddressDetails)).takeover()
        }
      },
      handler: (request, h) => {
        const {
          address1, address2, town, county, postcode
        } = request.payload

        setYarValue(request, 'agentAddressDetails', {
          address1, address2, town, county, postcode: postcode.toUpperCase()
        })

        return h.redirect('./farmer-details')
      }
    }
  }
]
