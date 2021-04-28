const appInsight = require('../../app/services/app-insights')

describe('get appInsight setup', () => {
  test('Should be defined', () => {
    expect(appInsight).toBeDefined()
  })
})
