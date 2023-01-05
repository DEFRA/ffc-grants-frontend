const mockSendEvent = jest.fn()
jest.mock('ffc-protective-monitoring', () => {
    return {
        PublishEvent: jest.fn().mockImplementation(() => {
            return { sendEvent: mockSendEvent }
        })
    }
})

const sendProtectiveMonitoringEvent = require('../../../../app/services/protective-monitoring-service-email')
let request

describe('send protective monitoring event', () => {
    const event = {
        test: 'test'
    }

    test('should send protective monitoring payload with x-forwarded-for header', async () => {
        request = {
            headers: {
                'x-forwarded-for': '127.0.0.1'
            }
        }

        await sendProtectiveMonitoringEvent(request, event, 'Test message')
        expect(mockSendEvent).toHaveBeenCalledTimes(1)
    })

    test('should send protective monitoring payload with remoteAddress', async () => {
        request = {
            headers: {
            },
            info: {
                remoteAddress: '127.0.0.1'
            }
        }

        await sendProtectiveMonitoringEvent(request, event, 'Test message')
        expect(mockSendEvent).toHaveBeenCalledTimes(2)
    })
})
