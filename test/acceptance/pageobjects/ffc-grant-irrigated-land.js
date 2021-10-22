import Page from './page'

class IrrigatedLand extends Page {
  /**
      * define elements
      */

  get currentIrrig () { return $('#irrigatedLandCurrent') }
  get targetIrrig () { return $('#irrigatedLandTarget') }

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
}
export default new IrrigatedLand()
