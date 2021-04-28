const pageName = 'progress-reference'
const { formatApplicationCode } = require('../helpers/helper-functions')
module.exports = [
  {
    method: 'GET',
    path: `/${pageName}`,
    handler: async (request, h) => {
      const confirmationId = formatApplicationCode(request.yar.id)
      const messageService = await require('../services/message-service')

      const inEngland = request.yar.get('inEngland')
      const businessName = request.yar.get('businessName')
      const emailAddress = request.query.email

      const httpPrefix = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const magicLink = `${httpPrefix}://${process.env.SITE_URL}/check-details?confirmationId=${confirmationId}`
      const emailLink = `${httpPrefix}://${process.env.SITE_URL}/load-application?application=${confirmationId}`

      try {
        await messageService.publishEOI(
          JSON.stringify({
            confirmationId,
            emailLink,
            inProgress: true,
            ...(inEngland ? { inEngland: 'yes' } : {}),
            ...(businessName ? { businessName: businessName } : {}),
            ...(emailAddress ? { progressEmailAddress: emailAddress } : {})
          })
        )
      } catch (err) {
        return h.view('confirmation', {
          output: {
            titleText: 'EOI not submitted',
            html: 'Error sending EOI'
          }
        })
      }

      if (emailAddress) {
        return h.view('progress-email', {
          emailAddress,
          magicLink,
          emailLink,
          backLink: '/',
          progressReference: confirmationId
        })
      } else {
        return h.view('progress-reference', {
          magicLink,
          backLink: '/',
          progressReference: confirmationId
        })
      }
    }
  }
]
