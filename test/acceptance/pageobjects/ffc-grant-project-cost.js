import Page from './page'

class ProjectCost extends Page {
  /**
      * define elements
      */

  get costField () { return $('#projectCost') }

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
}
export default new ProjectCost()
