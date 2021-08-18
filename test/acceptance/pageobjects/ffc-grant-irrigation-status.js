import Page from './page'

class IrrigationStatus extends Page {
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

  clickOnYesIrrigationStatus () {
    const element = $('#currentlyIrrigating')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoIrrigationStatus () {
    const element = $('#currentlyIrrigating-2')
    browser.execute('arguments[1].click();', element)
  }
}
export default new IrrigationStatus()
