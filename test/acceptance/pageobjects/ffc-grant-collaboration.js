import Page from './page'

class Collaboration extends Page {
  /**
      * define elements
      */

  get yescollab () { return $('#collaboration') }
  get nocollab () { return $('#collaboration-2') }
  get scorebtn () { return $('btnGetScore') }

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

  clickOnYesCollaboration () {
    const element = $('#collaboration')
    browser.execute('arguments[0].click();', element)
  }

  clickOnNoCollaboration () {
    const element = $('#collaboration-2')
    browser.execute('arguments[0].click();', element)
  }
}
export default new Collaboration()
