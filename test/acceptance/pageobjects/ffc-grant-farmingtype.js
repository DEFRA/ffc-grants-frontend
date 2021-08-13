import Page from './page'

class FarmingType extends Page {
  /**
    * define elements
    */

  get cropFarmingType () { return $('input#farmingType.govuk-radios__input') }
  get saveAndContinueButton () { return $('.govuk-button') }
  get saveAndContinueBut () { return $('//form/button') }
  get savAndContinueBut () { return $('button.govuk-button::before') }

  // css=form &gt; button.govuk-button    xpath=
  // And I click on Continue button
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

  clickOnCropFarmingType () {
    const element = $('input#farmingType.govuk-radios__input')
    browser.execute('arguments[0].click();', element)
  }

  clickOnHorticulture () {
    const element = $('input#farmingType-2.govuk-radios__input')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSaveandContinueButton () {
    // this.saveAndContinueButton().click()
    // this.saveAndContinueBut().click()
    this.savAndContinueBut().click()
  }

  async clickOnSaveandContinueButton2 () {
    await (await this.saveAndContinueBut).click()
  }
}
export default new FarmingType()
