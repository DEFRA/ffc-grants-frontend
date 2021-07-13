const path = require('path')
const { Pact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
let scheduleService
let provider

describe('Schedule contract test', () => {
  beforeAll(async () => {
    provider = new Pact({
      consumer: 'ffc-grants-frontend',
      provider: 'ffc-grants-eligibility',
      port: 1234,
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
    await provider.setup()
    const mockPaymentServiceUrl = provider.mockService.baseUrl
    jest.mock('../../app/config', () => ({
      paymentServiceUrl: mockPaymentServiceUrl
    }))
    scheduleService = require('../../app/services/payment-schedule-service')
  })

  test('GetAll returns schedule list (including optional fields)', async () => {
    await provider.addInteraction({
      state: 'schedules exist',
      uponReceiving: 'get all schedules',
      withRequest: {
        method: 'GET',
        path: '/schedule'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: Matchers.eachLike({
          claimId: Matchers.like('MINE123'),
          paymentDate: Matchers.iso8601DateTimeWithMillis()
        }, { min: 1 })
      }
    })

    const response = await scheduleService.getAll('token')
    expect(response[0]).toEqual(expect.objectContaining({
      claimId: 'MINE123',
      paymentDate: '2015-08-06T16:53:10.123+01:00'
    }))
  })

  test('Get schedule by claim id returns schedule info', async () => {
    await provider.addInteraction({
      state: 'schedule exists',
      uponReceiving: 'get schedule by claim id',
      withRequest: {
        method: 'GET',
        path: '/schedule/MINE001'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: Matchers.eachLike({
          claimId: Matchers.like('MINE001'),
          paymentDate: Matchers.iso8601DateTimeWithMillis()
        })
      }
    })

    const [schedule] = await scheduleService.getSchedulesByClaim('MINE001')
    expect(schedule).toEqual(expect.objectContaining({
      claimId: 'MINE001',
      paymentDate: '2015-08-06T16:53:10.123+01:00'
    }))
  })

  test('Get schedule by claim id returns 404 where claim id isn\'t found', async () => {
    await provider.addInteraction({
      state: 'schedule doesn\'t exist',
      uponReceiving: 'schedule by claim id',
      withRequest: {
        method: 'GET',
        path: '/schedule/NOTMINEWONTFIND'
      },
      willRespondWith: {
        status: 404
      }
    })

    await expect(scheduleService.getSchedulesByClaim('NOTMINEWONTFIND')).rejects.toThrow()
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
  })
})
