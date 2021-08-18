import Page from './page'

class SSSI extends Page {
  /**
      * define elements
      */

  get yesSSSI () { return $('#sSSI') }
  get noSSSI () { return $('#sSSI-2') }

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

  clickOnYesSSSI () {
    const element = $('#sSSI')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoSSSI () {
    const element = $('#sSSI-2')
    browser.execute('arguments[0].click();', element)
  }
}
export default new SSSI()
