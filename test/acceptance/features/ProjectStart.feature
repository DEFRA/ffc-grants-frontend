Feature: ProjectStart
#     Scenario Outline: Choosing different start work on the project
#              Given I open the url "/water/farming-type"
#              And I pause for 500ms
#              When I click on the element "#farmingType-2"  
#              When I click on the button "#btnContinue"
#              And I pause for 500ms
#              When I click on the element "#legalStatus-2"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on CountryYes button
#              And I pause for 500ms
#              And I clear the inputfield "#projectPostcode"
#              And I add "m24 4au" to the inputfield "#projectPostcode"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on "<permission>" button
#              And I click on Continue button 
#              And I pause for 500ms 
#              Then I expect that the url contains "/project-start"
#              When I click "<preparatoryWork>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/tenancy"
#              Examples:
#              |trades  |permission          |preparatoryWork|
#              |sole    |notNeededPermission |yesPrepWork    |
#              |trust   |secured             |noWorkDoneYet  |

#     Scenario: Choosing begun project work
#              Given I open the url "/water/farming-type"
#              And I pause for 500ms
#              When I click on the element "#farmingType-2"  
#              When I click on the button "#btnContinue"
#              And I pause for 500ms
#              When I click on the element "#legalStatus-2"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on CountryYes button
#              And I pause for 500ms
#              And I clear the inputfield "#projectPostcode"
#              And I add "m24 4au" to the inputfield "#projectPostcode"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on the element "#planningPermission" 
#              And I click on Continue button 
#              And I pause for 500ms 
#              Then I expect that the url contains "/project-start"
#              When I click on the element "#projectStarted-2"
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/project-start"

             