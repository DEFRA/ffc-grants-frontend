import Page from './page'

class PermissionPlaning extends Page {
  /**
      * define elements
      */

  get notNeeded () { return $('#planningPermission') }
  get secured () { return $('planningPermission-2') }
  get expectToHave () { return $('planningPermission-3') }
  get willNotHave () { return $('planningPermission-4') }
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

  clickOnNotNeededPermission () {
    const element = $('#planningPermission')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSecured () {
    const element = $('#planningPermission-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnExpectToHavePermission () {
    const element = $('#planningPermission-3')
    browser.execute('arguments[2].click();', element)
  }

  clickOnWillNotHavePermission () {
    const element = $('#planningPermission-4')
    browser.execute('arguments[3].click();', element)
  }
}
export default new PermissionPlaning()
