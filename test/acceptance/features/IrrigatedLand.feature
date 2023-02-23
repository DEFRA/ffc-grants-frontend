Feature: IrrigatedLand

      # Scenario Outline: Validating error message in the irrigated land page
      #        Given I open the url "/water/farming-type"
      #        And I pause for 500ms
      #        When I click on the element "#farmingType"  
      #        When I click on the button "#btnContinue"
      #        And I pause for 500ms
      #        When I click on the element "#legalStatus-2"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        And I click on CountryYes button
      #        And I pause for 500ms
      #        And I clear the inputfield "#projectPostcode"
      #        And I add "m24 4au" to the inputfield "#projectPostcode"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on the element "#planningPermission"   
      #        And I click on Continue button 
      #        And I pause for 500ms 
      #        When I click on the element "#projectStarted"  
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on yes land ownership button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        #When I click on the element "#projectInfrastucture"
      #        When I clicks "<projectItems>" buttons
      #        And I click on Continue button
      #        And I pause for 500ms
      #        #Then I expect that the url contains "/project-cost"
      #        When I clear the inputfield "#projectCost"
      #        And I add "900000" to the inputfield "#projectCost"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        And I click on Continue button
      #        And I pause for 500ms
      #        #When I click on the element "#payRemainingCosts"
      #        When I click the "<remainingCost>" buttons
      #        And I click on Continue button
      #        And I pause for 500ms
      #        Then I expect that the url contains "/abstraction-licence"
      #        When I click on abstraction licence button
      #        When I click on abstraction "<licence>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on project "<projectSummary>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on crops "<cropsIrrigated>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on the irrigation "<status>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        Then I expect that the url contains "/irrigated-land"
      #        When I clear the inputfield "#irrigatedLandCurrent"
      #        And I add "<hectare_1>" to the inputfield "#irrigatedLandCurrent" 
      #        And I clear the inputfield "#irrigatedLandTarget" 
      #        When I add "<hectare_2>" to the inputfield "#irrigatedLandTarget"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        Then I expect that element "#irrigatedLandTarget-error" contains the text "<errorExpectedMessage>"

      #        Examples:
      #        |projectItems |licence  |projectSummary     |remainingCost|cropsIrrigated     |status|hectare_1|hectare_2|errorExpectedMessage                                       |
      #        |construction |secured  |changeWater        | yes         |cropIrrigation     | yes  |    0    |   0     |Figure must be higher than 0                               |
      #        |engrFees     |secured  |increaseIrrigation | yes         |fruitIrrigation    | yes  |    10   |   9     |Figure must be equal to or higher than current hectares    |
      #        |overFlow     |secured  |increaseIrrigation | yes         |fruitIrrigation    | yes  |         |         |Enter how many hectares will be irrigated after the project|
             
             
            