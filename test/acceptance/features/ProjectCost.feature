Feature: ProjectItems
    # Scenario Outline: Choosing invalid estimated cost project
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
    #          When I click on the element "#projectInfrastucture"
    #         # When I clicks "<projectItems>" buttons
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/project-cost"
    #          When I clear the inputfield "#projectCost"
    #          And I add "<projectCost>" to the inputfield "#projectCost"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/project-cost"
    #          Examples:
    #          |projectCost|
    #          |34000      |
    #          |9999999    |
    #          |600000     |