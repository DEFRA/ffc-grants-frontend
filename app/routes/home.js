
const gapiService = require('../services/gapi-service')
function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: './farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/start',
  handler: async (request, h) => {
    request.yar.reset()
    gapiService.sendDimensionOrMetric(request, {
      category: gapiService.categories.JOURNEY,
      action: 'Start',
      dimensionOrMetric: gapiService.dimensions.START,
      value: request.yar?.id
    })
    gapiService.sendDimensionOrMetric(request, {
      category: gapiService.categories.JOURNEY,
      action: 'Start',
      dimensionOrMetric: gapiService.metrics.START,
      value: `${Date.now()}`
    })
    return h.view('home', createModel())
  }
}
