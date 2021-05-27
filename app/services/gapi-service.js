const appInsights = require('./app-insights')
const { getYarValue } = require('../helpers/session')
const dimensions = {
  SCORE: 'cd1',
  FINALSCORE: 'cd2',
  CONFIRMATION: 'cd5',
  ELIMINATION: 'cd6',
  AGENTFORMER: 'cd3'
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
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}
const sendDimensionOrMetrics = async (request, dimenisons) => {
  try {
    const dmetrics = {}
    dimenisons.forEach(item => {
      dmetrics[item.dimensionOrMetric] = item.value
    })
    await request.ga.pageView(dmetrics)
  } catch (err) {
    appInsights.logException(request, { error: err })
  }
}
const sendEligibilityEvent = async (request, isEligible = true) => {
  await sendDimensionOrMetric(request, {
    dimensionOrMetric: dimensions.ELIMINATION,
    value: isEligible
  })
  if (!isEligible) {
    await sendDimensionOrMetric(request, {
      dimensionOrMetric: metrics.ELIMINATION,
      value: getTimeofJourneySinceStart(request).toString()
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
module.exports = { sendEvent, sendDimensionOrMetric, sendEligibilityEvent, dimensions, categories, metrics, actions, sendJourneyTime, sendDimensionOrMetrics }
