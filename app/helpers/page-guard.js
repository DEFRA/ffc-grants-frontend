const { getYarValue } = require('../helpers/session')
const { startPageUrl, serviceEndDate, serviceEndTime } = require('../config/server')

function guardPage (request, guardData, rule = null) {
  let result = false
  const currentUrl = request.url.pathname.split('/').pop()
  const today = new Date(new Date().toDateString())
  const decomissionServiceDate = new Date(serviceEndDate)
  const time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London' })
  const dateExpired = +today > +decomissionServiceDate
  const expiringToday = (+today === +decomissionServiceDate) && (time > serviceEndTime)
  const serviceDecommissioned = expiringToday || dateExpired
  const isServiceDecommissioned = (request.url.pathname !== startPageUrl && currentUrl !== 'login' && serviceDecommissioned)
  if (isServiceDecommissioned) return isServiceDecommissioned
  if (guardData) {
    if (rule) {
      result = rule.condition === 'ANY' && !guardData.some(dependcyKey => getYarValue(request, dependcyKey) !== null)
    } else {
      result = guardData.filter(dependcyKey => getYarValue(request, dependcyKey) === null).length > 0
    }
  }
  return result
}

module.exports = { guardPage }
