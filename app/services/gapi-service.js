const appInsights = require('./app-insights')
const dimensions = {
  SCORE: 'dimension1',
  CONFIRMATION: 'dimension2',
  CONFIRM: 'dimension3',
  ELIMINATION: 'dimension4',
  AGENTFORMER: 'dimension5',
  START: 'dimension6'
}
const metrics = {
  START: 'metric1',
  SCORE: 'metric2',
  CONFIRMATION: 'metric3',
  ELIMINATION: 'metric4'
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
      userId: request.yar.id
    })
  } catch (err) {
    console.log(err)
    appInsights.logException(request, { error: err })
  }
}
const sendPageView = async (request) => {
  try {
    await request.ga.pageView()
  } catch (err) {
    console.log(err)
    appInsights.logException(request, { error: err })
  }
}

const sendDimensionOrMetric = async (request, { category, action, dimensionOrMetric, value }) => {
  try {
    await request.ga.event({
      category: category,
      userId: request.yar.id,
      action: action,
      label: dimensionOrMetric ?? '',
      value: value ?? ''
    })
  } catch (err) {
    console.log(err)
    appInsights.logException(request, { error: err })
  }
}
const sendNotEligibleEvent = async (request) => {
  await sendDimensionOrMetric(request, {
    category: categories.ELIMINATION,
    action: actions.ELIMINATION,
    dimensionOrMetric: dimensions.ELIMINATION,
    value: request.yar.id
  })
  await sendDimensionOrMetric(request, {
    category: categories.JOURNEY,
    action: actions.ELIMINATION,
    dimensionOrMetric: metrics.ELIMINATION,
    value: `${Date.now()}`
  })
}
module.exports = { sendEvent, sendPageView, sendDimensionOrMetric, sendNotEligibleEvent, dimensions, categories, metrics, actions }
