const appInsights = require('./app-insights')
const dimensions = {
  SCORE: 'dimension1',
  CONFIRMATION: 'dimension2',
  CONFIRM: 'dimension3',
  ELIMINATION: 'dimension4',
  AGENTFORMER: 'dimension5'
}
const metrics = {
  START: 'dimension1',
  SCORE: 'dimension2',
  CONFIRM: 'dimension3',
  CONFIRMATION: 'dimension4',
  ELIMINATION: 'dimension5'
}
const categories = {
  SCORE: 'Score',
  EXCEPTION: 'Exception',
  CONFIRMATION: 'Confirmation',
  ELIMINATION: 'Elimination',
  AGENTFORMER: 'Agent-Former'
}

const sendEvent = async (request, category, action) => {
  try {
    await request.ga.event({
      category: category,
      action: action
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

const sendDimension = async (request, { category, url, dimension, value }) => {
  try {
    await request.ga.event({
      category: category,
      action: url,
      label: dimension ?? '',
      value: value ?? ''
    })
  } catch (err) {
    console.log(err)
    appInsights.logException(request, { error: err })
  }
}
module.exports = { sendEvent, sendPageView, sendDimension, dimensions, categories, metrics }
