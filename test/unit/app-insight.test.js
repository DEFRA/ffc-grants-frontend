jest.mock('applicationinsights', () => {
  const original = jest.requireActual('applicationinsights')
  return {
    ...original,
    setup: jest.fn(() => ({ start: jest.fn() })),
    defaultClient: {
      context: {
        keys: { cloudRole: 'mock_cloudrole' },
        tags: {}
      },
      trackException: jest.fn((item) => null)
    }
  }
})

jest.mock('../../app/config/server', () => {
  const original = jest.requireActual('../../app/config/server')
  return {
    ...original,
    appInsights: {
      role: 'mock_role',
      key: 'mock_key'
    }
  }
})

const appInsights = require('applicationinsights')
const config = require('../../app/config/server')
const { setup, logException } = require('../../app/services/app-insights')

describe('App Insights', () => {
  test('setup', () => {
    expect(setup).toBeDefined()

    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole

    setup()
    expect(appInsights.setup().start).toBeDefined()
    expect(appInsights.defaultClient.context.tags[cloudRoleTag]).toEqual(config.appInsights.role)
  })

  test('logException', () => {
    expect(logException).toBeDefined()

    logException({}, {})

    const event = {
      error: 'mock_error',
      request: 'mock_request'
    }

    let req = {
      statusCode: 200,
      yar: { id: 'mock_id' },
      payload: 'mock_paylodd'
    }
    logException(req, event)
    expect(appInsights.defaultClient.trackException).toHaveBeenCalled()

    req = {
      statusCode: 200,
      payload: 'mock_paylodd'
    }
    expect(appInsights.defaultClient.trackException).toHaveBeenCalled()
  })
})
