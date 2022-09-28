const appInsights = require('./app-insights')
const { getYarValue } = require('../helpers/session')
const blockDefaultPageViews = [
  'applicant-details', 'confirmation', 'score'
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
const sendEligibilityEvent = async (request, isEligible = true) => {
  if (!isEligible) {
    await sendDimensionOrMetrics(request, [{
      dimensionOrMetric: metrics.ELIMINATION,
      value: getTimeofJourneySinceStart(request).toString()
    },
    {
      dimensionOrMetric: dimensions.ELIMINATION,
      value: isEligible
    }])
  } else {
    await sendDimensionOrMetric(request, {
      dimensionOrMetric: dimensions.ELIMINATION,
      value: isEligible
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
  sendValidationDimension
}
