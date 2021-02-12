const wreck = require('@hapi/wreck').defaults({
  json: true
})

function createModel (applicationDetails) {
  return {
    details: {
      rows: [
        {
          key: { text: 'Confirmation ID' },
          value: { text: applicationDetails.confirmationId }
        },
        {
          key: { text: 'Business name' },
          value: { text: applicationDetails.businessName }
        },
        {
          key: { text: 'Business in England' },
          value: { text: applicationDetails.inEngland ? 'Yes' : 'No' }
        },
        {
          key: { text: 'Email address' },
          value: { text: applicationDetails.emailAddress }
        },
        {
          key: { text: 'Created at' },
          value: { text: applicationDetails.createdAt }
        }
      ]
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/check-details',
    handler: async (request, h) => {
      try {
        const { payload } = await wreck.get(`http://${process.env.ELIGIBILITY_URL}/application?confirmationId=${request.query.confirmationId}`)
        return h.view('check-details', createModel(payload))
      } catch (err) {
        return h.view('not-found', {
          errorMessage: { titleText: `Application with confirmation ID ${request.query.confirmationId} not found` }
        })
      }
    }
  }
]
