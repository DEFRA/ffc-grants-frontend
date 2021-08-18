import Page from './page'

class ProjectSummary extends Page {
  /**
      * define elements
      */

  get chgWater () { return $('#project') }
  get improveIrrig () { return $('#project-2') }
  get increaseIrrig () { return $('#project-3') }
  get introIrrig () { return $('#project-4') }
  get noneIrrig () { return $('#project-5') }

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

  clickOnChangeWater () {
    const element = $('#project')
    browser.execute('arguments[0].click();', element)
  }

  clickOnImproveIrrigation () {
    const element = $('#project-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnIncreaseIrrigation () {
    const element = $('#project-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnIntroduceIrrigation () {
    const element = $('#project-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoneIrrigation () {
    const element = $('#project-5')
    browser.execute('arguments[0].click();', element)
  }
}
export default new ProjectSummary()
