import Page from './page'

class Tenancy extends Page {
  /**
      * define elements
      */

  get yesLandOwner () { return $('#landOwnership') }
  get noLandOwner () { return $('#landOwnership-2') }

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

  clickOnYesLandOwnership () {
    const element = $('#landOwnership')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoLandOwnership () {
    const element = $('#landOwnership-2')
    browser.execute('arguments[1].click();', element)
  }
}
export default new Tenancy()
