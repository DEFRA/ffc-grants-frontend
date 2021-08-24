import Page from './page'

class AgentDetails extends Page {
  /**
      * define elements
      */

  get firstNameField () { return $('#firstName') }
  get lastNameField () { return $('#lastName') }
  get businesNameField () { return $('#businessName') }
  get emailField () { return $('#email') }
  get mobileField () { return $('#mobile') }
  get landLineField () { return $('#landline') }
  get address1Field () { return $('#address1') }
  get address2Field () { return $('#address2') }
  get countyDropMenu () { return $('#county') }

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

  // clickOnCountyDropMenu () {
  //   const element = $('#county')
  //   browser.execute('arguments[0].click();', element)
  //   // $("#dropdown").selectByVisibleText("Option 2")
  // }

  clickOnCountyDropMenu () {
    $('#county').selectByVisibleText('Greater Manchester')
  }

  // clickOnYesCollaboration () {
  //   const element = $('#collaboration')
  //   browser.execute('arguments[0].click();', element)
  // }
}
export default new AgentDetails()
