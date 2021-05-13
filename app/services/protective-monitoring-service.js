const { PublishEvent } = require('ffc-protective-monitoring')
const config = require('../config/server')

async function sendEvent (request, sessionId, event, pmcCode) {
  const protectiveMonitoring = new PublishEvent(config.protectiveMonitoringUrl)
  await protectiveMonitoring.sendEvent({
    sessionid: sessionId,
    datetime: createEventDate(),
    version: '1.1',
    application: 'DEP00085',
    component: 'Eligibility and Desirability Web UI',
    ip: request ? getIpAddress(request) : '',
    pmccode: pmcCode,
    priority: '0',
    details: {
      message: event
    }
  })
  console.log(`Protective monitoring event sent: ${event}`)
}

function getIpAddress (request) {
  const xForwardedForHeader = request.headers['x-forwarded-for']
  return xForwardedForHeader ? xForwardedForHeader.split(',')[0] : request.info.remoteAddress
}

function createEventDate () {
  const eventDate = new Date()
  return eventDate.toISOString()
}

module.exports = sendEvent
