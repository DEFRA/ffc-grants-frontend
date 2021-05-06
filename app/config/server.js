// Build config
const config = {
  protectiveMonitoringUrl: process.env.PROTECTIVE_MONITORING_URL,
  appInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    role: process.env.APPINSIGHTS_CLOUDROLE
  }
}

module.exports = config
