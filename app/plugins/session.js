const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
module.exports = {
  plugin: {
    name: 'session',
    register: (server, options) => {
      server.ext('onPreAuth', function (request, reply) {
        const existingId = request.yar.get('Key')
        if (existingId !== request.yar.id) {
          protectiveMonitoringServiceSendEvent(request, request.yar.id, 'FTF-SESSION-CREATED')
        }
        request.yar.set('Key', request.yar.id)
        return reply.continue
      })
    }
  }
}
