import Page from './page'

class Licence extends Page {
  /**
      * define elements
      */

  get notNeeded () { return $('#abstractionLicence-2') }
  get secured () { return $('#abstractionLicence-2') }
  get expectToHave () { return $('#abstractionLicence-3') }
  get willNotHave () { return $('#abstractionLicence-4') }
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

  clickOnNotNeededLicense () {
    const element = $('#abstractionLicence')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSecured () {
    const element = $('#abstractionLicence-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnExpectToHaveLicence () {
    const element = $('#abstractionLicence-3')
    browser.execute('arguments[2].click();', element)
  }

  clickOnWillNotHaveLicence () {
    const element = $('#abstractionLicence-4')
    browser.execute('arguments[3].click();', element)
  }
}
export default new Licence()
