const Analytics = require('@defra/hapi-gapi/lib/analytics')
const { getYarValue, setYarValue } = require('../helpers/session')
exports.plugin = {
  name: 'Gapi',
  /**
     * Initialise the hapi-gapi plugin
     *
     * @param server the hapi server instance
     * @param options the hapi-gapi configuration settings
     */
  register: async (server, options) => {
    const analytics = new Analytics(options)

    server.decorate('request', 'ga', request => analytics.ga(request), { apply: true })

    server.ext('onPreResponse', async (request, h) => {
      try {
        const response = request.response
        const statusFamily = Math.floor(response.statusCode / 100)
        if (statusFamily === 2 && response.variety === 'view' && (getYarValue(request, 'GA-Sent') ?? false) === false) {
          console.log('Sending analytics page-view for %s', request.route.path)
          await request.ga.pageView()
        } else if (statusFamily === 5) {
          console.log('Sending exception event for route %s with with status code %s', request.route.path, response.statusCode)
          await request.ga.event({ category: 'Exception', action: request.route.path, label: response.statusCode })
        }
        setYarValue(request, 'GA-Sent', false)
      } catch {
        // ignore any error
      }
      return h.continue
    })

    server.ext('onPostStop', async () => {
      await analytics.shutdown()
      server.log(['hapi-gapi'], 'All buffered events sent to the Google Analytics Measurement Protocol API.')
    })
  }
}
