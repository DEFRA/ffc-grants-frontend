const createMsg = require('../messaging/create-msg')
const { urlPrefix, startPageUrl } = require('../config/server')
const { setYarValue } = require('../helpers/session')

const viewTemplate = 'check-details'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/applicant-details`
const nextPath = `${urlPrefix}/confirm`
const startPath = startPageUrl
const businessDetailsPath = `${urlPrefix}/business-details`
const agentDetailsPath = `${urlPrefix}/agent-details`
const farmerDetailsPath = previousPath

function createModel (data) {
  const model = {
    businessDetailsLink: businessDetailsPath,
    farmerDetailsLink: farmerDetailsPath,
    businessDetails: data.businessDetails,
    farmerDetails: data.farmerDetails.firstName + ' ' + data.farmerDetails.lastName,
    farmerAddressDetails: `${data.farmerDetails.address1}${(data.farmerDetails.address2 ?? '').length > 0 ? '<br/>' : ''}${data.farmerDetails.address2}<br/>${data.farmerDetails.town}<br/>${data.farmerDetails.county}<br/>${data.farmerDetails.postcode}`,
    farmerPostcode: data.farmerDetails.Postcode,
    farmerProjectPostcode: data.farmerDetails.projectPostcode,
    farmerBusinessPostcode: data.farmerDetails.BusinessPostcode,
    farmerContactDetails: `${data.farmerDetails.email}${(data.farmerDetails.landline ?? '').length > 0 ? '<br/>' : ''}${data.farmerDetails.landline}<br/>${data.farmerDetails.mobile}`
  }
  if (data.agentDetails) {
    model.agentDetailsLink = agentDetailsPath
    model.agentBusinessName = data.agentDetails.businessName
    model.agentDetails = data.agentDetails.firstName + ' ' + data.agentDetails.lastName
    model.agentAddressDetails = `${data.agentDetails.address1}${(data.agentDetails.address2 ?? '').length > 0 ? '<br/>' : ''}${data.agentDetails.address2}<br/>${data.agentDetails.town}<br/>${data.agentDetails.county}<br/>${data.agentDetails.postcode}`
    model.agentContactDetails = `${data.agentDetails.email}${(data.agentDetails.landline ?? '').length > 0 ? '<br/>' : ''}${data.agentDetails.landline}<br/>${data.agentDetails.mobile}`
  }
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...model
  }
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  options: {
    log: {
      collect: true
    }
  },
  handler: (request, h, err) => {
    const msg = createMsg.getAllDetails(request, '')
    if (!msg.farmerDetails) {
      return h.redirect(startPath)
    }
    setYarValue(request, 'checkDetails', 'true')
    return h.view(viewTemplate, createModel(msg))
  }
},
{
  method: 'POST',
  path: currentPath,
  handler: (request, h) => {
    return h.redirect(nextPath)
  }
}]
