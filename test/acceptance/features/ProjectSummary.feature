 Feature: ProjectSummary
#     Scenario Outline: Choosing more that 2 project impact
#              Given I open the url "/water/farming-type"
#              And I pause for 500ms
#              When I click on the element "#farmingType"  
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
#              When I click on the element "#planningPermission"   
#              And I click on Continue button 
#              And I pause for 500ms 
#              When I click on the element "#projectStarted"  
#              And I click on Continue button
#              And I pause for 500ms
#              When I click on yes land ownership button
#              And I click on Continue button
#              And I pause for 500ms
#              #When I click on the element "#projectInfrastucture"
#              When I clicks "<projectItems>" buttons
#              And I click on Continue button
#              And I pause for 500ms
#              #Then I expect that the url contains "/project-cost"
#              When I clear the inputfield "#projectCost"
#              And I add "900000" to the inputfield "#projectCost"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on Continue button
#              And I pause for 500ms
#              #When I click on the element "#payRemainingCosts"
#              When I click the "<remainingCost>" buttons
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/SSSI"
#              When I click the "<SSSI>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/abstraction-licence"
#              When I click on abstraction licence button
#              When I click on abstraction "<licence>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/project-summary"
#              When I click on project "<projectSummary>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that element "#project-error" contains the text "Select up to 2 options to describe your project’s impact"
#              Examples:
#              |projectItems |SSSI|licence  |projectSummary                           |remainingCost|
#              |construction |yes |secured  |changeWater&IncreaseIrrig&IntroIrrigation| yes         |
                                
#              Scenario Outline: Choosing project is non impact (None of the above)
#              Given I open the url "/water/farming-type"
#              And I pause for 500ms
#              When I click on the element "#farmingType"  
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
#              When I click on the element "#planningPermission"   
#              And I click on Continue button 
#              And I pause for 500ms 
#              When I click on the element "#projectStarted"  
#              And I click on Continue button
#              And I pause for 500ms
#              When I click on yes land ownership button
#              And I click on Continue button
#              And I pause for 500ms
#              #When I click on the element "#projectInfrastucture"
#              When I clicks "<projectItems>" buttons
#              And I click on Continue button
#              And I pause for 500ms
#              #Then I expect that the url contains "/project-cost"
#              When I clear the inputfield "#projectCost"
#              And I add "900000" to the inputfield "#projectCost"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on Continue button
#              And I pause for 500ms
#              #When I click on the element "#payRemainingCosts"
#              When I click the "<remainingCost>" buttons
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/SSSI"
#              When I click the "<SSSI>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/abstraction-licence"
#              When I click on abstraction licence button
#              When I click on abstraction "<licence>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/project-summary"
#              When I click on project "<projectSummary>" button
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/irrigated-crops" 
#              Examples:
#              |projectItems |SSSI|licence  |projectSummary  |remainingCost|
#              |overFlow     |no  |notNeeded| noneOfTheAbove | yes         |      

             