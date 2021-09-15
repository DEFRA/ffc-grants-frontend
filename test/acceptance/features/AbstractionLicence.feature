Feature: AbstractionLicence
    # Scenario Outline: Choosing different Abstraction Licence happy path
    #          Given I open the url "/water/farming-type"
    #          And I pause for 500ms
    #          When I click on the element "#farmingType"  
    #          When I click on the button "#btnContinue"
    #          And I pause for 500ms
    #          When I click on the element "#legalStatus-2"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on CountryYes button
    #          And I pause for 500ms
    #          And I clear the inputfield "#projectPostcode"
    #          And I add "m24 4au" to the inputfield "#projectPostcode"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on the element "#planningPermission"   
    #          And I click on Continue button 
    #          And I pause for 500ms 
    #          When I click on the element "#projectStarted"  
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on yes land ownership button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          #When I click on the element "#projectInfrastucture"
    #          When I clicks "<projectItems>" buttons
    #          And I click on Continue button
    #          And I pause for 500ms
    #          #Then I expect that the url contains "/project-cost"
    #          When I clear the inputfield "#projectCost"
    #          And I add "900000" to the inputfield "#projectCost"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on the element "#payRemainingCosts"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/SSSI"
    #          When I click the "<SSSI>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/abstraction-licence"
    #          When I click on abstraction licence button
    #          When I click on abstraction "<licence>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/project-summary"
    #          Examples:
    #          |projectItems     |SSSI|licence  |
    #          |construction     |yes |secured  |
    #          |overFlow         |no  |notNeeded|


    #          Scenario Outline: Choosing different Abstraction Licence
    #          Given I open the url "/water/farming-type"
    #          And I pause for 500ms
    #          When I click on the element "#farmingType"  
    #          When I click on the button "#btnContinue"
    #          And I pause for 500ms
    #          When I click on the element "#legalStatus-2"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on CountryYes button
    #          And I pause for 500ms
    #          And I clear the inputfield "#projectPostcode"
    #          And I add "m24 4au" to the inputfield "#projectPostcode"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on the element "#planningPermission"   
    #          And I click on Continue button 
    #          And I pause for 500ms 
    #          When I click on the element "#projectStarted"  
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on yes land ownership button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          #When I click on the element "#projectInfrastucture"
    #          When I clicks "<projectItems>" buttons
    #          And I click on Continue button
    #          And I pause for 500ms
    #          #Then I expect that the url contains "/project-cost"
    #          When I clear the inputfield "#projectCost"
    #          And I add "900000" to the inputfield "#projectCost"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on Continue button
    #          And I pause for 500ms
    #          #When I click on the element "#payRemainingCosts"
    #          When I click the "<remainingCost>" buttons
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/SSSI"
    #          When I click the "<SSSI>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/abstraction-licence"
    #          When I click on abstraction licence button
    #          When I click on abstraction "<licence>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/abstraction-required-condition"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/project-summary"
    #          Examples:
    #          |projectItems     |SSSI|licence              |remainingCost|
    #          |syntheticliner   |yes |expectToHaveLicence  |   yes       |
    #          |engrFees         |no  |notHaveLicence       |   yes       |