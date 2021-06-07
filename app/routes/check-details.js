const createMsg = require('../messaging/create-msg')
function createModel (data) {
  const model = {
    businessDetails: data.businessDetails,
    farmerDetails: data.farmerDetails.firstName + ' ' + data.farmerDetails.lastName,
    farmerAddressDetails: `${data.farmerDetails.address1}${(data.farmerDetails.address2 ?? '').length > 0 ? '<br/>' : ''}${data.farmerDetails.address2}<br/>${data.farmerDetails.town}<br/>${data.farmerDetails.county}<br/>${data.farmerDetails.postcode}`,
    farmerContactDetails: `${data.farmerDetails.email}${(data.farmerDetails.landline ?? '').length > 0 ? '<br/>' : ''}${data.farmerDetails.landline}<br/>${data.farmerDetails.mobile}`
  }
  if (data.agentDetails) {
    model.agentBusinessName = data.agentDetails.businessName
    model.agentDetails = data.agentDetails.firstName + ' ' + data.agentDetails.lastName
    model.agentAddressDetails = `${data.agentDetails.address1}${(data.agentDetails.address2 ?? '').length > 0 ? '<br/>' : ''}${data.agentDetails.address2}<br/>${data.agentDetails.town}<br/>${data.agentDetails.county}<br/>${data.agentDetails.postcode}`
    model.agentContactDetails = `${data.agentDetails.email}${(data.agentDetails.landline ?? '').length > 0 ? '<br/>' : ''}${data.agentDetails.landline}<br/>${data.agentDetails.mobile}`
  }
  return {
    backLink: './farmer-details',
    ...model
  }
}

module.exports = [{
  method: 'GET',
  path: '/check-details',
  options: {
    log: {
      collect: true
    }
  },
  handler: (request, h, err) => {
    const msg = createMsg.getAllDetails(request, '')
    if (!msg.farmerDetails) {
      return h.redirect('./start')
    }
    return h.view('check-details', createModel(msg))
  }
},
{
  method: 'POST',
  path: '/check-details',
  handler: (request, h) => {
    return h.redirect('./confirm')
  }
}]
