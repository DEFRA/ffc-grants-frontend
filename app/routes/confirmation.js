const { formatApplicationCode } = require('../helpers/helper-functions')

module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: async (request, h) => {
    const confirmationId = formatApplicationCode(request.yar.id)

    console.log('New application:')
    console.log(`In England: ${request.yar.get('inEngland')}`)
    console.log(`Business Name: ${request.yar.get('businessName')}`)
    console.log(`Email Address: ${request.yar.get('emailAddress')}`)
    console.log(`ConfirmationID: ${confirmationId}`)

    const httpPrefix = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const magicLink = `${httpPrefix}://${process.env.SITE_URL}/check-details?confirmationId=${confirmationId}`
    const messageService = await require('../services/message-service')

    try {
      await messageService.publishEOI(
        JSON.stringify({
          confirmationId: confirmationId.toString(),
          inEngland: request.yar.get('inEngland') === 'yes',
          businessName: request.yar.get('businessName'),
          emailAddress: request.yar.get('emailAddress'),
          magicLink: magicLink
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

    return h.view('confirmation', {
      output: {
        titleText: 'EOI submitted',
        html: `Your reference number<br><strong>${confirmationId}</strong>`,
        link: magicLink
      }
    })
  }
}
