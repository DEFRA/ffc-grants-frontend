import Page from './page'

class RemainingCost extends Page {
  // define elements

  get yesRemainCost () { return $('#payRemainingCosts') }
  get noRemainCost () { return $('#payRemainingCosts-2') }

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

  clickOnYesRemainingCost () {
    const element = $('#payRemainingCosts')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoRemainingCost () {
    const element = $('#payRemainingCosts-2')
    browser.execute('arguments[0].click();', element)
  }
}
export default new RemainingCost()
