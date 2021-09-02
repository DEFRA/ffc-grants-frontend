Feature: Legal Status        
         Scenario Outline: Choosing differents types of legal status
             Given I open the url "/water/farming-type"
             And I pause for 500ms
             #Then I expect that the url contains "/farming-type" 
             When I click on the element "#farmingType-2"  
             When I click on the button "#btnContinue"
             And I pause for 500ms
             Then I expect that the url contains "/legal-status"
             And I pause for 500ms
             When I clicks on the "<trades>" button 
             And I click on Continue button
             And I pause for 500ms
             Then I expect that the url contains "/country"
             Examples:
             |trades        |
             |trust         |
             |sole          |
             |partnership   |
             |limitedCompany|
             |charity       |
             |liaPartnership|
             |communityInt  |
             |ltdPartnership|
             |industrialSty |
             |coopSociety   |
             |BenCom        |



             Scenario Outline: Choosing differents types of legal status
             Given I open the url "/water/farming-type"
             And I pause for 500ms
             #Then I expect that the url contains "/farming-type" 
             When I click on the element "#farmingType-2"  
             When I click on the button "#btnContinue"
             And I pause for 500ms
             Then I expect that the url contains "/legal-status"
             And I pause for 500ms
             When I clicks on the "<trades>" button 
             And I click on Continue button
             And I pause for 500ms
             Then I expect that the url contains "/legal-status"
             #And I pause for 500ms
             #Then I expect that element "#div.govuk-grid-column-two-thirds>h1.govuk-heading-l" contains the text "You cannot apply for a grant from this scheme"                                                  
             #Then I expect that element "//main[@id='main-content']/div/div/h1" is displayed
             #Then I expect that element "//div/h1" is displayed           
             Examples:
             |None of the above|
             

   

   
    #   Scenario: Choosing limited company legal status
    #       Given I open the url "/water/farming-type"   http://localhost:3000/water/legal-status
    #       And I pause for 500ms
    #       Then I expect that the url contains "/farming-type" 
    #       When I click on the element "#farmingType-3"  
    #       When I click on the button "#btnContinue"
    #       And I pause for 500ms
    #       When I click on the limited company button  
    #       When I click on the button "#btnContinue"
    #       And I pause for 500ms
    #       Then I expect that the url contains "/country"
    #       Then I expect that element "h1" contains the text "Is the planned project in England?"
      
    #  Scenario: Choosing Charity legal status
    #    Scenario: Choosing sole trader legal status
    #       Given I open the url "/water/legal-status"
    #       And I pause for 500ms
    #       Then I expect that the url contains "/legal-status" 
        #   When I click on the element "#farmingType"  
        #   When I click on the button "#btnContinue"
        #   And I pause for 500ms
        #   When I click on the element "#legalStatus"  
        #   When I click on the button "#btnContinue"
        #   And I pause for 500ms
        #   Then I expect that the url contains "/country"
         # Then I expect that element "h1" contains the text "Is the planned project in England?"
    
   

    
    
          
   