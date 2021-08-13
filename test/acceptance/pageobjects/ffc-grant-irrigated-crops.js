import Page from './page'

class IrrigatedCrops extends Page {
  /**
      * define elements
      */

  get crop () { return $('#irrigatedCrops') }
  get cropping () { return $('#irrigatedCrops-2') }
  get fruit () { return $('#irrigatedCrops-3') }

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

  clickOnCropIrrigation () {
    const element = $('#irrigatedCrops')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCroppingIrrigation () {
    const element = $('#irrigatedCrops-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnFruitIrrigation () {
    const element = $('#irrigatedCrops-3')
    browser.execute('arguments[0].click();', element)
  }
}
export default new IrrigatedCrops()
