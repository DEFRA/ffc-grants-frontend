Feature: Check details

      # Scenario: Reject Cookies
      #   Given I open the url "/start"
      #   And I pause for 500ms
      #   Then I expect that element "h1" contains the text "Check if you can apply for a Farming Transformation Fund water management grant"
      #   When I click on the element "//button[2]"
      #   When I click on the link "Start now"
      #   Then I expect that the url contains "/farming-type"

      # Scenario Outline: Change business details
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
      #        When I clicks "<projectItems>" buttons
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I clear the inputfield "#projectCost"
      #        And I add "900000" to the inputfield "#projectCost"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click the "<remainingCost>" buttons
      #        And I click on Continue button
      #        And I pause for 500ms
      #        Then I expect that the url contains "/SSSI"
      #        When I click the "<SSSI>" button
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
      #        When I clear the inputfield "#irrigatedLandCurrent"
      #        And I add "<hectare_1>" to the inputfield "#irrigatedLandCurrent" 
      #        And I clear the inputfield "#irrigatedLandTarget" 
      #        When I add "<hectare_2>" to the inputfield "#irrigatedLandTarget"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click irrigation "<waterSource_Current>" button 
      #        And I click irrigation "<waterSource_Target>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on irrigation "<irrigationSystem_Current>" button
      #        And I click on irrigation "<irrigationSystem_Target>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        When I click on project improve "<productivity>" button
      #        And I click on Continue button
      #        And I pause for 500ms
      #        Then I expect that the url contains "/collaboration"
      #        When I click on the button "#collaboration"           
      #        When I click on the button "#btnGetScore"
      #        And I pause for 500ms
      #        Then I expect that the url contains "/score"  
      #        And I click on Continue button
      #        And I pause for 500ms
      #        Then I expect that the url contains "/business-details"
      #        When I clear the inputfield "#projectName"
      #        And I add "<projectName>" to the inputfield "#projectName"
      #        And I clear the inputfield "#businessName"
      #        And I add "<businessName>" to the inputfield "#businessName"
      #        And I clear the inputfield "#numberEmployees"
      #        And I add "<employeeNo>" to the inputfield "#numberEmployees"
      #        And I clear the inputfield "#businessTurnover"
      #        And I add "<turnover>" to the inputfield "#businessTurnover"            
      #        And I click on the button "#inSbi"
      #        And I pause for 500ms
      #        And I add "106651310" to the inputfield "#sbi"
      #        And I click on Continue button
      #        And I pause for 500ms
      #        And I click on the button "#applying"
      #        And I click on Continue button 
      #        And I pause for 500ms
      #        Then I expect that the url contains "/farmer-details"
      #        When I clear the inputfield "#firstName"
      #        When I add "kaz" to the inputfield "#firstName"
      #        And I add "ola" to the inputfield "#lastName"
      #        And I add "kaz.iyiola@dev.gov.uk" to the inputfield "#email"
      #        And I add "45545634122" to the inputfield "#mobile"
      #        And I add "01616666933" to the inputfield "#landline"
      #        And I add "64 Great Arbor Way" to the inputfield "#address1"
      #        And I add "Middleton, Manchester" to the inputfield "#address2"
      #        And I select county name in the dropdown menu   
      #        And I add "M24 4AU" to the inputfield "#postcode"
      #        And I click on Continue button 
      #        And I pause for 500ms
      #        Then I expect that the url contains "/water/check-details"
      #        #When I click on the business-details link
      #        When I click on the element "//*[normalize-space(text())and normalize-space(.)='Check your details'][1]/following::a[1]"
      #        And I pause for 500ms
      #        Then I expect that the url contains "/business-details" 
      #        When I clear the inputfield "#businessName"  
      #        And I add "Olakaz Farm" to the inputfield "#businessName"
      #        And I click on the element "#Back-to-details"
      #        And I pause for 500ms
      #        Then I expect that the url contains "/water/check-details" 
      #    #   Then I expect that element "//*/text()[normalize-space(.)='Olakaz Farm']/parent::*" contains the text "Olakaz Farm"   
      #        Examples:
      #        |projectItems |SSSI|licence|projectSummary|remainingCost|cropsIrrigated |status|hectare_1|hectare_2|waterSource_Current|waterSource_Target|irrigationSystem_Current|irrigationSystem_Target|productivity   |projectName|businessName|employeeNo|turnover|                                                                                  
      #        |construction |yes |secured|changeWater   | yes         |cropIrrigation | yes  |    7    |   8     |currentPeakFlow    |plannedPeakFlow   |currentBoom             |plannedBoom            |protectedCrops |   kaz     |   kazola4  |  1000    |  123   |
                                                                                                                                                                                                                                