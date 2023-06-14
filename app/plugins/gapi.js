const Analytics = require('@defra/hapi-gapi/lib/analytics')
const gapiService = require('../services/gapi-service')
const { getYarValue } = require('../helpers/session')

const blockDefaultPageViews = ['start', 'applying'] // -- blocked pages
const blockScoreReached = ['business-details', 'applying', 'agent-details', 'applicant-details', 'check-details', 'confirm', 'confirmation'] // -- blocked score reached

exports.plugin = {
  name: 'Gapi',
  /**
     * Initialise the hapi-gapi plugin & send default page view to google analytics.
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
        if (statusFamily === 2 && response.variety === 'view' && !gapiService.isBlockDefaultPageView(blockDefaultPageViews, request.url)) {
          await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.PAGEVIEW, params: { page_path: request.route.path, page_title: request.route.fingerprint, scoreReached: !!getYarValue(request, 'current-score') && !gapiService.isBlockDefaultPageView(blockScoreReached, request.url) } })
        }
        if (statusFamily === 5) {
          await request.ga.event({ category: 'Exception', action: request.route.path, label: response.statusCode })
        }
      } catch (error) {
        console.log(`[THIS IS GA ERROR: ${error}]`)
      }
      return h.continue
    })
  }
}
