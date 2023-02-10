import Page from './page'

class WaterSource extends Page {
  /**
      * define elements
      */

  get currentPeakFlow () { return $('#waterSourceCurrent') }
  get currentBoreHole () { return $('#waterSourceCurrent-2') }
  get currentRainWater () { return $('#waterSourceCurrent-3') }
  get currentSummerWater () { return $('#waterSourceCurrent-4') }
  get currentMains () { return $('#waterSourceCurrent-5') }
  get plannedPeakFlow () { return $('#waterSourcePlanned') }
  get plannedBoreHole () { return $('#waterSourcePlanned-2') }
  get plannedRainWater () { return $('#waterSourcePlanned-3') }
  get plannedSummerWater () { return $('#waterSourcePlanned-4') }
  get plannedMains () { return $('#waterSourcePlanned-5') }

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

  clickOnCurrentPeakFlow3 () {
    const test = document.querySelector('#waterSourceCurrent')

    test.addEventListener('click', function () {
      console.log('Congrats! You have reached the clickController!')
    })
  };

  // clickOnCurrentPeakFlow2 () {
  //   const test = document.querySelector('#waterSourceCurrent')

  //   test.addEventListener('click', clickOnCurrentPeakFlow2 () {
  //     //console.log('Congrats! You have reached the clickController!')
  //   })
  // };

  clickOnCurrentPeakFlow () {
    // const element = $('#waterSourceCurrent')
    const element = $('#waterSourceCurrent.govuk-checkboxes__input')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCropIrrigation () {
    const element = $('#irrigatedCrops')
    browser.execute('arguments[0].click();', element)
  }

  // clickOnCurrentPeakFlow3 () {
  //   const element = $('#waterSourceCurrent')
  //   browser.execute('arguments[0].click();', element)
  // }

  clickOnCurrentBoreHole () {
    const element = $('#waterSourceCurrent-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentRainWater () {
    const element = $('#waterSourceCurrent-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentSummerWater () {
    const element = $('#waterSourceCurrent-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCurrentMainsWater () {
    const element = $('#waterSourceCurrent-5')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedPeakFlow () {
    const element = $('#waterSourcePlanned')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedBoreHole () {
    const element = $('#waterSourcePlanned-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedRainWater () {
    const element = $('#waterSourcePlanned-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedSummerWater () {
    const element = $('#waterSourcePlanned-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPlannedMainsWater () {
    const element = $('#waterSourcePlanned-5')
    browser.execute('arguments[0].click();', element)
  }
}
export default new WaterSource()
