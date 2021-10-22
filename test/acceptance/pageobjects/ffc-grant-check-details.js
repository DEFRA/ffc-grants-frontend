import Page from './page'

class CheckDetails extends Page {
  /**
      * define elements
      */

  get businessDetailsLink () { return $("//*[normalize-space(text())and normalize-space(.)='Check your details'][1]/following::a[1]") }
  //                                      //*[normalize-space(text())and normalize-space(.)='Check your details'][1]/following::a[1]
  get farmerDetailsLink () { return $('//a[contains(@href, "/water/farmer-details")]') }

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

  clickOnBusinessDetailsLink2 () {
    const element = $('//*[normalize-space(text())and normalize-space(.)="Check your details"][1]/following::a[1]')
    browser.execute('arguments[0].click();', element)
  }

  clickOnBusinessDetailsLink1 () {
    this.businessDetailsLink()
  }

  async clickOnBusinessDetailsLink () {
    await (await this.businessDetailsLink()).click()
  }

  // clickOnYesCollaboration () {
  //   const element = $('#collaboration')
  //   browser.execute('arguments[0].click();', element)
  // }
}
export default new CheckDetails()
