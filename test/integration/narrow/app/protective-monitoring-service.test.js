describe('Protective monitoring service', () => {
  const sendEvent = require('../../../../app/services/protective-monitoring-service')

  test('check sendEvent()', async () => {
    let request = { headers: { 'x-forwarded-for': 'mock,xforw,for' } }
    expect(await sendEvent(request, 'sessionId', 'event', 'pmcCode')).toBe(undefined)

    request = {
      headers: { 'x-forwarded-for': '' },
      info: { remoteAddress: 'mock-addr' }
    }
    expect(await sendEvent(request, 'sessionId', 'event', 'pmcCode')).toBe(undefined)
  })
})
