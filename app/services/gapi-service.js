const appInsights = require('./app-insights')
const { getYarValue, setYarValue } = require('../helpers/session')
const { sendMonitoringEvent } = require('../services/protective-monitoring-service')

const blockDefaultPageViews = [
  'start', 'applying', 'confirmation', 'remaining-costs',
  'project-cost', 'project-start', 'planning-permission', 'score',
  'country', 'legal-status', 'farming-type'
]
const isBlockDefaultPageView = (url) => {
  const currentUrl = url.pathname.split('/').pop().toString().toLowerCase()
  return blockDefaultPageViews.indexOf(currentUrl) >= 0
}
const dimensions = {
  SCORE: 'cd1',
  FINALSCORE: 'cd2',
  CONFIRMATION: 'cd5',
  ELIMINATION: 'cd6',
  AGENTFORMER: 'cd3',
  ANALYTICS: 'cd4',
  PRIMARY: 'cd7',
  VALIDATION: 'cd8'
}
const metrics = {
  SCORE: 'cm3',
  CONFIRMATION: 'cm1',
  ELIGIBILITY: 'cm2',
  ELIMINATION: 'cm4'
}

const actions = {
  START: 'Start',
  SCORE: 'Score',
  CONFIRMATION: 'Confirmation',
  ELIMINATION: 'Elimination'
}
const categories = {
  SCORE: 'Score',
  EXCEPTION: 'Exception',
  CONFIRMATION: 'Confirmation',
  ELIMINATION: 'Elimination',
  AGENTFORMER: 'Agent-Former',
  JOURNEY: 'Journey'
}

const sendEvent = async (request, category, action) => {
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
const sendDimensionOrMetric = async (request, { dimensionOrMetric, value }) => {
  try {
    const dmetrics = {}
    dmetrics[dimensionOrMetric] = value
    await request.ga.pageView(dmetrics)
    console.log('Metric Sending analytics page-view for %s', request.route.path)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}
const sendValidationDimension = async (request) => {
  sendDimensionOrMetric(request, { dimensionOrMetric: dimensions.VALIDATION, value: true })
}
const sendDimensionOrMetrics = async (request, dimenisons) => {
  try {
    const dmetrics = {}
    dimenisons.forEach(item => {
      if (item.value === 'TIME') {
        item.value = getTimeofJourneySinceStart(request).toString()
      }
      dmetrics[item.dimensionOrMetric] = item.value
    })
    await request.ga.pageView(dmetrics)
    console.log('Metrics Sending analytics page-view for %s', request.route.path)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}
const sendEligibilityEvent = async (request, notEligible = false) => {
  if (notEligible) {
    await sendDimensionOrMetrics(request, [{
      dimensionOrMetric: metrics.ELIMINATION,
      value: getTimeofJourneySinceStart(request).toString()
    },
    {
      dimensionOrMetric: dimensions.ELIMINATION,
      value: false
    }])
    console.log('[ NOT ELIGIBLE MATRIC SENT ]')
  } else {
    await sendDimensionOrMetric(request, {
      dimensionOrMetric: dimensions.ELIMINATION,
      value: notEligible
    })
  }
}
const sendJourneyTime = async (request, metric) => {
  await sendDimensionOrMetric(request, {
    dimensionOrMetric: metric,
    value: getTimeofJourneySinceStart(request).toString()
  })
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
      await sendDimensionOrMetrics(request, cmcds)
    }
  }
}

module.exports = {
  sendEvent,
  sendDimensionOrMetric,
  sendEligibilityEvent,
  dimensions,
  categories,
  metrics,
  actions,
  sendJourneyTime,
  sendDimensionOrMetrics,
  isBlockDefaultPageView,
  sendValidationDimension,
  processGA
}
