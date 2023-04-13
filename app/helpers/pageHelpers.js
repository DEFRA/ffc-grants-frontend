const { getHtml } = require('../helpers/conditionalHTML')
const { setOptionsLabel } = require('../helpers/answer-options')
const { getYarValue, setYarValue } = require('../helpers/session')

const getConfirmationId = (guid) => {
  const prefix = 'WM'
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}

const handleConditinalHtmlData = (type, labelData, yarKey, request) => {
  const isMultiInput = type === 'multi-input'
  const label = isMultiInput ? 'sbi' : yarKey
  const fieldValue = isMultiInput ? getYarValue(request, yarKey)?.sbi : getYarValue(request, yarKey)
  return getHtml(label, labelData, fieldValue)
}

const saveValuesToArray = (yarKey, fields) => {
  const result = []

  if (yarKey) {
    fields.forEach(field => {
      if (yarKey[field]) {
        result.push(yarKey[field])
      }
    })
  }

  return result
}

const getCheckDetailsModel = (request, question, backUrl, nextUrl) => {
  setYarValue(request, 'reachedCheckDetails', true)

  const applying = getYarValue(request, 'applying')
  const businessDetails = getYarValue(request, 'businessDetails')
  const agentDetails = getYarValue(request, 'agentDetails')
  const farmerDetails = getYarValue(request, 'farmerDetails')

  const agentContact = saveValuesToArray(agentDetails, ['emailAddress', 'mobile', 'landline'])
  const agentAddress = saveValuesToArray(agentDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

  const farmerContact = saveValuesToArray(farmerDetails, ['emailAddress', 'mobile', 'landline'])
  const farmerAddress = saveValuesToArray(farmerDetails, ['address1', 'address2', 'town', 'county', 'businessPostcode'])

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    applying,
    businessDetails,
    farmerDetails: {
      ...farmerDetails,
      ...(farmerDetails
        ? {
            name: `${farmerDetails.firstName} ${farmerDetails.lastName}`,
            contact: farmerContact.join('<br/>'),
            address: farmerAddress.join('<br/>')
          }
        : {}
      )
    },
    agentDetails: {
      ...agentDetails,
      ...(agentDetails
        ? {
            name: `${agentDetails.firstName} ${agentDetails.lastName}`,
            contact: agentContact.join('<br/>'),
            address: agentAddress.join('<br/>')
          }
        : {}
      )
    }

  })
}

const getDataFromYarValue = (request, yarKey, type) => {
  let data = getYarValue(request, yarKey) || null
  if (type === 'multi-answer' && !!data) {
    data = [data].flat()
  }

  return data
}

const getConsentOptionalData = (consentOptional) => {
  return {
    hiddenInput: {
      id: 'consentMain',
      name: 'consentMain',
      value: 'true',
      type: 'hidden'
    },
    idPrefix: 'consentOptional',
    name: 'consentOptional',
    items: setOptionsLabel(consentOptional,
      [{
        value: 'CONSENT_OPTIONAL',
        text: '(Optional) I consent to being contacted about improving services'
      }]
    )
  }
}

module.exports = {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getDataFromYarValue,
  getConsentOptionalData
}
