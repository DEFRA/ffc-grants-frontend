import Page from './page'

class Collaboration extends Page {
  /**
      * define elements
      */

  get yescollab () { return $('#collaboration') }
  get nocollab () { return $('#collaboration-2') }
  get scorebtn () { return $('btnGetScore') }
  get yesScoreBtn () { return $('//tr[7]/th/ul/li') }
  get overallScoreBtn () { return $('//main/div/div/div/div/h2') }

  // Then I expect that element "//tr[7]/th/ul/li" contains the text "Yes"
  // Then I expect that element "//main/div/div/div/div/h2" contains the text "Average"
  // Then I expect that element "//main[@id='main-content']/div/div[2]/div/table/tbody/tr/td" contains the text "Average"
  // Then I expect that element "//tr[3]/td " contains the text "Strong"
  // Then I expect that element "//tr[4]/td " contains the text "Average"
  // Then I expect that element "//tr[5]/td " contains the text "Average"
  // Then I expect that element "//tr[6]/td " contains the text "Average"
  // Then I expect that element "//tr[7]/td " contains the text "Strong"

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
