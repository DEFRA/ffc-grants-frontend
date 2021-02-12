const wreck = require('@hapi/wreck').defaults({
  json: true
})

async function loadApplication (h, yar, reference) {
  try {
    const { payload } = await wreck.get(`http://${process.env.ELIGIBILITY_URL}/application?confirmationId=${reference}`)

    const yarKeys = ['inEngland', 'businessName']

    for (const [key, value] of Object.entries(payload)) {
      if (yarKeys.includes(key)) {
        yar.set(key, value)
      }
    }
    const nextPage = payload.businessName ? './contact-details' : './business'
    return h.redirect(nextPage)
  } catch (err) {
    return h.view('not-found', {
      errorMessage: { titleText: `Application with confirmation ID ${reference} not found` }
    })
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/load-application',
    options: {
      handler: (request, h) => loadApplication(h, request.yar, request.query.application)
    }
  },
  {
    method: 'POST',
    path: '/load-application',
    options: {
      handler: (request, h) => loadApplication(h, request.yar, request.payload.application)
    }
  }
]
