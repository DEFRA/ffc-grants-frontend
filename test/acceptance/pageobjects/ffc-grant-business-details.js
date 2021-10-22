import Page from './page'

class BusinessDetails extends Page {
  /**
      * define elements
      */

  get nameField () { return $('#projectName') }
  get businessField () { return $('#businessName') }
  get empNoField () { return $('#numberEmployees') }
  get turnOverField () { return $('#businessTurnover') }
  get yesRadioBtn () { return $('#inSbi') }
  get noRadioBtn () { return $('#inSbi-2') }
  get sbiField () { return $('#sbi') }

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

  clickOnYesSBIButton () {
    const element = $('#inSbi')
    browser.execute('arguments[0].click();', element)
  }
}
export default new BusinessDetails()
