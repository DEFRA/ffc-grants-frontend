const { PublishEvent } = require('ffc-protective-monitoring')
const config = require('../config/server')

async function sendEvent (request, sessionId, event) {
  const protectiveMonitoring = new PublishEvent(config.protectiveMonitoringUrl)
  await protectiveMonitoring.sendEvent({
    sessionid: sessionId,
    datetime: createEventDate(),
    version: '1.1',
    application: 'ffc-grants-frontend',
    component: 'ffc-grants-frontend',
    ip: getIpAddress(request),
    pmccode: '001',
    priority: '0',
    details: {
      message: event
    }
  })
  console.log(`Protective monitoring event sent: ${event}`)
}

function getIpAddress (request) {
  // Identifying the originating IP address of a client connecting to a web server through an HTTP proxy or a load balancer
  const xForwardedForHeader = request.headers['x-forwarded-for']
  return xForwardedForHeader ? xForwardedForHeader.split(',')[0] : request.info.remoteAddress
}

function createEventDate () {
  const eventDate = new Date()
  return eventDate.toISOString()
}

module.exports = sendEvent
