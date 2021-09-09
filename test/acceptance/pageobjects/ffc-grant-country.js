import Page from './page'

class Country extends Page {
  /**
      * define elements
      */

  get ctyYes () { return $('#inEngland') }
  get ctyNo () { return $('#inEngland-2') }
  get ctyPostCode () { return $('#projectPostcode') }
  //

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

  clickOnCtyYesButton () {
    const element = $('#inEngland')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCtyNoButton () {
    const element = $('#inEngland-2')
    browser.execute('arguments[0].click();', element)
  }

  async clickOnCtyPostCode () {
    await (await this.ctyPostCode).click()
  }
}
export default new Country()
