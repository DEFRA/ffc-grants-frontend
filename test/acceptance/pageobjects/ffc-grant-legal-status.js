import Page from './page'

class LegalStatus extends Page {
  /**
      * define elements
      */

  get soleTrade () { return $('legalStatus') }
  get partnership () { return $('legalStatus-2') }
  get ltdCompany () { return $('legalStatus-3') }

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

  clickOnSoleTrade () {
    const element = $('#legalStatus')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPartnership () {
    const element = $('#legalStatus-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnLimitedCompany () {
    const element = $('#legalStatus-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCharity () {
    const element = $('#legalStatus-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnTrust () {
    const element = $('#legalStatus-5')
    browser.execute('arguments[0].click();', element)
  }

  clickOnLimitedLiabilityPartnership () {
    const element = $('#legalStatus-6')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCommunityInterestCompany () {
    const element = $('#legalStatus-7')
    browser.execute('arguments[0].click();', element)
  }

  clickOnLimitedPartnership () {
    const element = $('#legalStatus-8')
    browser.execute('arguments[0].click();', element)
  }

  clickOnIndustrialAndProvidentSociety () {
    const element = $('#legalStatus-9')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCooperativeSociety () {
    const element = $('#legalStatus-10')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCommunityBenefitSociety () {
    const element = $('#legalStatus-11')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoneOfTheAbove () {
    const element = $('#legalStatus-13')
    browser.execute('arguments[0].click();', element)
  }
}
export default new LegalStatus()
