import Page from './page'

class IrrigationSystem extends Page {
  /**
      * define elements
      */

  get currentBoom () { return $('#irrigationCurrent') }
  get currentCapillary () { return $('#irrigationCurrent-2') }
  get currentEbb () { return $('#irrigationCurrent-3') }
  get currentMist () { return $('#irrigationCurrent-4') }
  get currentRain () { return $('#irrigationCurrent-5') }
  get currentSprinklers () { return $('#irrigationCurrent-6') }
  get currentTrickle () { return $('#irrigationCurrent-7') }

  get plannedBoom () { return $('#irrigationPlanned') }
  get plannedCapillary () { return $('#irrigationPlanned-2') }
  get plannedEbb () { return $('#irrigationPlanned-3') }
  get plannedMist () { return $('#irrigationPlanned-4') }
  get plannedRain () { return $('#irrigationPlanned-5') }
  get plannedSprinklers () { return $('#irrigationPlanned-6') }
  get plannedTrickle () { return $('#irrigationPlanned-7') }

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

  clickOnCurrentBoom () {
    const element = $('#irrigationCurrent')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentCapillary () {
    const element = $('#irrigationCurrent-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentEbb () {
    const element = $('#irrigationCurrent-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentMist () {
    const element = $('#irrigationCurrent-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentRain () {
    const element = $('#irrigationCurrent-5')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentSprinklers () {
    const element = $('#irrigationCurrent-6')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentTrickle () {
    const element = $('#irrigationCurrent-7')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedBoom () {
    const element = $('#irrigationPlanned')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedCapillary () {
    const element = $('#irrigationPlanned-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedEbb () {
    const element = $('#irrigationPlanned-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedMist () {
    const element = $('#irrigationPlanned-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedRain () {
    const element = $('#irrigationPlanned-5')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedSprinklers () {
    const element = $('#irrigationPlanned-6')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedTrickle () {
    const element = $('#irrigationPlanned-7')
    browser.execute('arguments[0].click();', element)
  }
}
export default new IrrigationSystem()
