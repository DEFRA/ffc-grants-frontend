import Page from './page'

class Applying extends Page {
  /**
      * define elements
      */

  get agentRadioBtn () { return $('#applying-2') }
  get farmerRadioBtb () { return $('#applying') }

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

  clickOnAgentRadioBtn () {
    const element = $('#applying-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnFarmerRadioBtn () {
    const element = $('#applying')
    browser.execute('arguments[0].click();', element)
  }
}
export default new Applying()
