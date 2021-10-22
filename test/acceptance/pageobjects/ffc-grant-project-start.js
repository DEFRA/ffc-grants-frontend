import Page from './page'

class ProjectStart extends Page {
  /**
      * define elements
      */

  get yesPrepWork () { return $('#projectStarted') }
  get yesBeganProject () { return $('#projectStarted-2') }
  get noProjectYet () { return $('#projectStarted-3') }

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

  clickOnYesPrepWork () {
    const element = $('#projectStarted')
    browser.execute('arguments[0].click();', element)
  }

  clickOnYesBeganProject () {
    const element = $('#projectStarted-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoProjectYet () {
    const element = $('#projectStarted-3')
    browser.execute('arguments[0].click();', element)
  }
}
export default new ProjectStart()
