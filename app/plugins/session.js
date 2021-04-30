const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
module.exports = {
  plugin: {
    name: 'session',
    register: (server, options) => {
      server.ext('onPreAuth', async function (request, reply) {
        const existingId = request.yar.get('Key')
        if (existingId !== request.yar.id) {
          await protectiveMonitoringServiceSendEvent(request, request.yar.id, 'FTF-SESSION-CREATED', '0701')
        }
        request.yar.set('Key', request.yar.id)
        return reply.continue
      })
    }
  }
}
