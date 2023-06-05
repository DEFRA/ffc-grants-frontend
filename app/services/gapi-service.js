const appInsights = require('./app-insights')
const { getYarValue, setYarValue } = require('../helpers/session')
const { sendMonitoringEvent } = require('../services/protective-monitoring-service')

const blockDefaultPageViews = ['start', 'applying'] // -- blocked pages
const isBlockDefaultPageView = (url) => {
  const currentUrl = url.pathname.split('/').pop().toString().toLowerCase()
  return blockDefaultPageViews.indexOf(currentUrl) >= 0
}

const grant_type = 'Water Management'
const dimensions = { // get rid of this
  SCORE: 'cd1',
  FINALSCORE: 'cd2',
  CONFIRMATION: 'cd5',
  ELIMINATION: 'cd6', // -- here
  AGENTFORMER: 'cd3',
  ANALYTICS: 'cd4',
  PRIMARY: 'cd7',
  VALIDATION: 'cd8'
}
const metrics = { // get rid of this
  SCORE: 'cm3',
  CONFIRMATION: 'cm1',
  ELIGIBILITY: 'cm2',
  ELIMINATION: 'cm4' // -- here
}

const actions = { // keep this
  START: 'Start',
  SCORE: 'Score',
  CONFIRMATION: 'Confirmation',
  ELIMINATION: 'Elimination'  // -- here
}
const categories = {
  SCORE: 'Score',
  EXCEPTION: 'Exception',
  CONFIRMATION: 'Confirmation',
  ELIMINATION: 'Elimination', // -- here
  AGENTFORMER: 'Agent-Former',
  JOURNEY: 'Journey'
}

const eventTypes = {
  PAGEVIEW: 'pageview',
  SCORE: 'score',
  ELIGIBILITY: 'eligibility',
  CONFIRMATION: 'confirmation',
  ELIMINATION: 'elimination', // -- here
  EXCEPTION: 'exception',
}
// generic one that's used in weird ways!
const sendEvent = async (request, category, action) => {
  console.log('sendEvent: -------', JSON.stringify(request));
  try {
    await request.ga.event({
      category: category,
      action: action,
      userId: request.yar?.id
    })
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}
// This function sends the page view
const sendDimensionOrMetric = async (request, { dimensionOrMetric, value }) => {
  try {
    const dmetrics = {}
    dmetrics[dimensionOrMetric] = value
    console.log('here: sendDimensionOrMetric: ', dmetrics);
    // -- here sedning pageView
    // console.log('here: ', 'tryin pageView!', request.ga.pageView);
    await request.ga.pageView(dmetrics)
    console.log('Metric Sending analytics page-view for %s', request.route.path)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}
// sends some UA metrics -- scrap!
const sendValidationDimension = async (request) => {
  // send validation dimension
  console.log('------: sendValidationDimension:', request.yar?.id);
  await sendDimensionOrMetric(request, { dimensionOrMetric: dimensions.VALIDATION, value: true })
}
// sends some UA metrics with page view -- scrap after stealing that cool replacer!
const sendDimensionOrMetrics = async (request, dimenisons) => {
  // -- here
  try {
    const dmetrics = {}
    dimenisons.forEach(item => {
      if (item.value === 'TIME') { // Cool!!
        item.value = getTimeofJourneySinceStart(request).toString()
      }
      dmetrics[item.dimensionOrMetric] = item.value
    })
    // -- here
    // var entire = request.ga.pageView.toString(); 
    // console.log('here: ', 'tryin pageView! TEXT', entire);
    await request.ga.pageView(dmetrics)
    console.log('Metrics Sending analytics page-view for %s', request.route.path)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}

const sendGAEvent = async (request, metrics) => {
  const timeSinceStart = getTimeofJourneySinceStart(request).toString()
  const page_path = request.route.path
  const {name, params} = metrics;
  const isEliminationEvent = name === eventTypes.ELIMINATION;
  const isScoreEvent = name === eventTypes.SCORE;
  const isConfirmationEvent = name === eventTypes.CONFIRMATION;
  const dmetrics = {
    ...params,
    ...(isEliminationEvent && { elimination_time: timeSinceStart }),
    ...(isScoreEvent && { score_time: timeSinceStart }),
    ...(isConfirmationEvent && { confirmation_time: timeSinceStart }),
    ...(params.score_presented && { score_presented: params.score_presented }),
    ...(params.score && {score: params.score}),
    ...(params.user_type &&{ user_type: params.user_type}),
    grant_type,
    page_path,
    page_title: page_path,
    test: 'testig v.1.6'
  }
  try {
    console.log('dmetrics:::::: ', dmetrics);
    const event = { name, params: dmetrics }
    await request.ga.view(request, [ event ])
    console.log('Metrics Sending analytics %s for %s', name, request.route.path)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
  console.log('[ %s MATRIC SENT ]', name.toUpperCase())
}

// const sendJourneyTime = async (request, metric) => {
//   await sendDimensionOrMetric(request, {
//     dimensionOrMetric: metric,
//     value: getTimeofJourneySinceStart(request).toString()
//   })
// }
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
  sendEvent,
  sendDimensionOrMetric,
  dimensions,
  categories,
  metrics,
  actions,
  // sendJourneyTime,
  sendDimensionOrMetrics,
  isBlockDefaultPageView,
  sendValidationDimension,
  processGA,
  sendGAEvent,
}
