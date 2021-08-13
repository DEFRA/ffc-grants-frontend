Feature: Grant 

    Scenario: Open start page

        Given I open the url "/start"
        And I pause for 500ms
        #Then I expect that element "h1" contains the text "Check if you can apply for a Farming Transformation Fund water management grant"
        When I click on the link "Start now"
        Then I expect that the url contains "/farming-type" 
        #When I clicks on the button 
        When I click on the element "#farmingType"  
        #When I click on Continue button
        When I click on the button "#btnContinue"
        And I pause for 500ms
        Then I expect that the url contains "/legal-status"
        And I pause for 500ms
        When I clicks on the sole trade button 
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/country"
        When I click on CountryYes button
        And I pause for 500ms
        When I add "m24 4au" to the inputfield "#projectPostcode"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/planning-permission"
        When I click on not needed permission button
        And I click on Continue button 
        And I pause for 500ms 
        Then I expect that the url contains "/project-start"
        When I click on Yes preparatory work button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/tenancy"
        When I click on yes land ownership button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/project-items"
        And I pause for 500ms
        When I click on project items buttons
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/project-cost"
        When I add "900000" to the inputfield "#projectCost"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/potential-amount"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/remaining-costs"
        And I pause for 500ms
        When I click on remaining cost buttons
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/SSSI"
        And I pause for 500ms
        When I click on SSSI button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/abstraction-licence"
        When I click on abstraction licence button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/project-summary"
        When I click on project impact button
        When I click on the element "#project-2" 
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigated-crops" 
        When I click on crops irrigated button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigation-status"
        When I click on irrigation status button 
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigated-land"
        When I add "100" to the inputfield "#irrigatedLandCurrent"
        When I add "101" to the inputfield "#irrigatedLandTarget"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigation-water-source"
        When I click on irrigation water source button
        When I click on the element "#waterSourcePlanned"    
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigation-systems"
        When I click on irrigation system button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/productivity"
        When I click on project improve productivity button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/collaboration"
        #When I click on project improve productivity button
        #When I click on the element "#productivity"
        When I click on the button "#collaboration"
        When I click on the button "#btnGetScore"
        And I pause for 700ms
        Then I expect that the url contains "/score"


    