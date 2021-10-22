import Page from './page'

class Start extends Page {
  /**
      * define elements
      */

  get rejectCookies () { return $('#button.govuk-button.js-cookies-button-reject') }
  get acceptCookies () { return $('#button.govuk-button.js-cookies-button-accept') }

  /**
       * define or overwrite page methods
       */
  open () {
    super.open('')
    browser.pause(3000)
  }
  /**
       * your page specific methods
       */

  clickOnRejectCookies () {
    this.rejectCookies.click()
  }
  // clickOnRejectCookies () {
  //   const element = $('#button.govuk-button.js-cookies-button-reject')
  //   browser.execute('arguments[0].click();', element)
  // }

  clickOnAcceptCookies () {
    const element = $('#button.govuk-button.js-cookies-button-accept')
    browser.execute('arguments[0].click();', element)
  }
}
export default new Start()
