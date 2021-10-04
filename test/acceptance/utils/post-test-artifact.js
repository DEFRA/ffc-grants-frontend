const moment = require('moment')
const fs = require('fs')

const SCREENSHOTS_DIR = './output/screenshots'
const PAGE_SOURCES_DIR = './output/page-sources'

function takeScreenshot (browser) {
  const screenshotFileName = `SCREENSHOT_${getBrowserName(browser)}_${getTimestamp()}.png`
  const screenshotPath = `${SCREENSHOTS_DIR}/${screenshotFileName}`

  try {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    browser.saveScreenshot(screenshotPath)
    console.log(`Screenshot "${screenshotPath}" saved`)
  } catch (err) {
    console.warn(`Failed saving "${screenshotPath}" screenshot:`)
    console.warn(err)
  }
}

function savePageSource (browser) {
  const pageSourceFileName = `PAGE_SOURCE_${getBrowserName(browser)}_${getTimestamp()}.html`
  const pageSourcePath = `${PAGE_SOURCES_DIR}/${pageSourceFileName}`

  try {
    fs.mkdirSync(PAGE_SOURCES_DIR, { recursive: true })
    fs.writeFileSync(pageSourcePath, browser.getPageSource())
    console.log(`Page source "${pageSourcePath}" saved`)
  } catch (err) {
    console.warn(`Failed saving "${pageSourcePath}" page source:`)
    console.warn(err)
  }
}

function getTimestamp () {
  return moment().format('YYYY-MM-DD-HH-mm-ss.SSS')
}

function getBrowserName (browser) {
  return browser.capabilities.browserName.replace(/\s+/g, '')
}

module.exports = {
  takeScreenshot,
  savePageSource
}
