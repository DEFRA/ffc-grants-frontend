import Page from './page'

class Productivity extends Page {
  /**
      * define elements
      */
  get product1 () { return $('#productivity') }
  get product2 () { return $('#productivity-2') }
  get product3 () { return $('#productivity-3') }
  get product4 () { return $('#productivity-2') }
  get product5 () { return $('#productivity-3') }

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

  clickOnproductivity1 () {
    const element = $('#productivity')
    browser.execute('arguments[0].click();', element)
  }

  clickOnproductivity2 () {
    const element = $('#productivity-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnproductivity3 () {
    const element = $('#productivity-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnproductivity4 () {
    const element = $('#productivity-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnproductivity5 () {
    const element = $('#productivity-5')
    browser.execute('arguments[0].click();', element)
  }
}
export default new Productivity()
