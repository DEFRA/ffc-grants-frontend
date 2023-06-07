const appInsights = require('./app-insights')
const { getYarValue, setYarValue } = require('../helpers/session')
const { sendMonitoringEvent } = require('../services/protective-monitoring-service')

const blockDefaultPageViews = ['start', 'applying'] // -- blocked pages
const isBlockDefaultPageView = (url) => {
  const currentUrl = url.pathname.split('/').pop().toString().toLowerCase()
  return blockDefaultPageViews.indexOf(currentUrl) >= 0
}

const grant_type = 'Water Management'

const eventTypes = {
  PAGEVIEW: 'pageview',
  SCORE: 'score',
  ELIGIBILITY: 'eligibility',
  CONFIRMATION: 'confirmation',
  ELIMINATION: 'elimination',
  EXCEPTION: 'exception',
}

const sendGAEvent = async (request, metrics) => {
  const timeSinceStart = getTimeofJourneySinceStart(request).toString()
  const pagePath = request.route.path
  const { name, params } = metrics
  const isEliminationEvent = name === eventTypes.ELIMINATION
  const isScoreEvent = name === eventTypes.SCORE
  const isConfirmationEvent = name === eventTypes.CONFIRMATION
  const dmetrics = {
    ...params,
    ...(isEliminationEvent && { elimination_time: '00:00:50' }),
    ...(isScoreEvent && { score_time: timeSinceStart }),
    ...(isConfirmationEvent && { confirmation_time: timeSinceStart }),
    ...(params.score_presented && { score_presented: params.score_presented }),
    ...(params.final_score && { final_score: params.final_score }),
    ...(params.user_type && { user_type: params.user_type }),
    grant_type,
    pagePath,
    page_title: pagePath,
    test: 'testig v.1.6'
  }
  try {
    console.log('dmetrics:::::: ', dmetrics)
    const event = { name, params: dmetrics }
    await request.ga.view(request, [event])
    console.log('Metrics Sending analytics %s for %s', name, request.route.path)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
  console.log('[ %s MATRIC SENT ]', name.toUpperCase())
}


const getTimeofJourneySinceStart = (request) => {
  if (getYarValue(request, 'journey-start-time')) {
    return Math.abs(((new Date()).getTime() - (new Date(getYarValue(request, 'journey-start-time'))).getTime()) / 1000)
  }
  return 0
}

const processGA = async (request, ga, _score, _confirmationId) => {
  if (ga && Array.isArray(ga)) {
    const cmcds = []
    ga.forEach(async gaConfig => {
      if (gaConfig.journeyStart) {
        setYarValue(request, 'journey-start-time', Date.now())
        console.log('[JOURNEY STARTED] ')
      }
      if (gaConfig.dimension) {
        let value
        switch (gaConfig.value.type) {
          case 'yar':
            value = getYarValue(request, gaConfig.value.key)
            break
          case 'custom':
            value = gaConfig.value.value
            break
          case 'score':
            value = gaConfig.value.value
            break
          case 'confirmationId':
            await sendMonitoringEvent(request, request.yar.id, 'FTF-JOURNEY-COMPLETED', '0706')
            value = gaConfig.value.value
            break
          case 'journey-time':
            value = getTimeofJourneySinceStart(request).toString()
            break
          default:
            value = gaConfig.value.value
        }

        cmcds.push({
          dimensionOrMetric: gaConfig.dimension,
          value: value?.toString()
        })
      }
    })
    if (cmcds.length > 0) {
      // await sendDimensionOrMetrics(request, cmcds)
    }
  }
}

module.exports = {
  isBlockDefaultPageView,
  sendGAEvent,
  eventTypes
}
