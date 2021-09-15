 Feature: Grant 

#     Scenario: Open start page
        
#         Given I open the url "/start"
#         And I pause for 500ms
#         #Then I expect that element "h1" contains the text "Check if you can apply for a Farming Transformation Fund water management grant"
#         When I click on the link "Start now"
#         Then I expect that the url contains "/farming-type" 
#         #When I clicks on the button 
#         When I click on the element "#farmingType"  
#         #When I click on Continue button
#         When I click on the button "#btnContinue"
#         And I pause for 500ms
#         Then I expect that the url contains "/legal-status"
#         And I pause for 500ms
#         When I clicks on the sole trade button 
#         And I click on Continue button
#         And I pause for 600ms
#         Then I expect that the url contains "/country"
#         When I click on CountryYes button
#         And I pause for 500ms
#         When I add "m24 4au" to the inputfield "#projectPostcode"
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/planning-permission"
#         When I click on not needed permission button
#         And I click on Continue button 
#         And I pause for 500ms 
#         Then I expect that the url contains "/project-start"
#         When I click on Yes preparatory work button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/tenancy"
#         When I click on yes land ownership button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/project-items"
#         And I pause for 500ms
#         When I click on project items buttons
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/project-cost"
#         When I add "900000" to the inputfield "#projectCost"
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/potential-amount"
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/remaining-costs"
#         And I pause for 500ms
#         When I click on remaining cost buttons
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/SSSI"
#         And I pause for 500ms
#         When I click on SSSI button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/abstraction-licence"
#         When I click on abstraction licence button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/project-summary"
#         When I click on project impact button
#         When I click on the element "#project-2" 
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/irrigated-crops" 
#         When I click on crops irrigated button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/irrigation-status"
#         When I click on irrigation status button 
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/irrigated-land"
#         When I add "100" to the inputfield "#irrigatedLandCurrent"
#         When I add "101" to the inputfield "#irrigatedLandTarget"
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/irrigation-water-source"
#         When I click on irrigation water source button
#         When I click on the element "#waterSourcePlanned"    
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/irrigation-systems"
#         When I click on irrigation system button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/productivity"
#         When I click on project improve productivity button
#         And I click on Continue button
#         And I pause for 500ms
#         Then I expect that the url contains "/collaboration"
#         #When I click on project improve productivity button
#         #When I click on the element "#productivity"
#         When I click on the button "#collaboration"
#         When I click on the button "#btnGetScore"
#         And I pause for 700ms
#         Then I expect that the url contains "/score"


    Scenario: Reject Cookies
        Given I open the url "/start"
        And I pause for 500ms
        Then I expect that element "h1" contains the text "Check if you can apply for a Farming Transformation Fund water management grant"
        When I click on the element "//button[2]"
        When I click on the link "Start now"
        Then I expect that the url contains "/farming-type"
  
    Scenario Outline: Submittion of grant application
        Given I open the url "/start"
        And I pause for 500ms
        Then I expect that element "h1" contains the text "Check if you can apply for a Farming Transformation Fund water management grant"
        #When I click on the reject cookies
        #When I click on the element "//button[2]"
        #When I click on the element "<rejectCookies>"
        When I click on the link "Start now"
        Then I expect that the url contains "/farming-type"
        #When I clicks on the button 
        When I click on the element "<cropType>"  
        #When I click on Continue button
        When I click on the button "#btnContinue"
        And I pause for 500ms
        Then I expect that the url contains "/legal-status"
        And I pause for 500ms
        When I clicks on the "<trades>" button 
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/country"
        When I click on CountryYes button
        And I pause for 500ms
        And I clear the inputfield "#projectPostcode"
        And I add "m24 4au" to the inputfield "#projectPostcode"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/planning-permission"
        When I click on "<permission>" button
        #When I click on the button "#btnContinue"
        And I click on Continue button 
        And I pause for 500ms 
        Then I expect that the url contains "/project-start"
        When I click "<preparatoryWork>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/tenancy"
        When I click on yes land ownership button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/project-items"
        And I pause for 500ms
        When I clicks "<projectItems>" buttons
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/project-cost"
        When I clear the inputfield "#projectCost"
        And I add "900000" to the inputfield "#projectCost"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/potential-amount"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/remaining-costs"
        And I pause for 500ms
        # When I click the "<remainingCost>" buttons
        When I click on remaining cost buttons
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/SSSI"
        And I pause for 500ms
        When I click the "<SSSI>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/abstraction-licence"
        # When I click on abstraction licence button
        When I click on abstraction "<licence>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/project-summary"
       # When I click on project impact button
       # When I click on the element "#project-2" 
       # When I click on the element "<projectSummary>"
        When I click on project "<projectSummary>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigated-crops" 
        #When I click on crops irrigated button
        When I click on crops "<cropsIrrigated>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigation-status"
        When I click on irrigation status button 
        #When I click on irrigation "<status>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigated-land"
        #When I add "100" to the inputfield "#irrigatedLandCurrent"   
        #When I add "101" to the inputfield "#irrigatedLandTarget"
        When I clear the inputfield "#irrigatedLandCurrent"
        And I add "<hectare_1>" to the inputfield "#irrigatedLandCurrent" 
        And I clear the inputfield "#irrigatedLandTarget" 
        When I add "<hectare_2>" to the inputfield "#irrigatedLandTarget"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigation-water-source"
        #When I click on irrigation water source button
        And I pause for 1000ms
        When I click irrigation "<waterSource_Current>" button 
        And I click irrigation "<waterSource_Target>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/irrigation-systems"
        #When I click on irrigation system button
        When I click on irrigation "<irrigationSystem_Current>" button  
        And I click on irrigation "<irrigationSystem_Target>" button
        #When I click on the element "#irrigationPlanned"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/productivity"
        #When I click on project improve productivity button
        When I click on project improve "<productivity>" button
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/collaboration"
        When I click on the button "#collaboration"
        When I click on the button "#btnGetScore"
        And I pause for 700ms
        Then I expect that the url contains "/score"
        Then I expect that element "//tr[7]/th/ul/li" contains the text "Yes"
        Then I expect that element "//main/div/div/div/div/h2" contains the text "<overllscore>"
        Then I expect that element "//main[@id='main-content']/div/div[2]/div/table/tbody/tr/td" contains the text "<productImpact>"
        Then I expect that element "//tr[3]/td " contains the text "<currentLandIrrig>"  
        Then I expect that element "//tr[4]/td " contains the text "<currentWaterSource>"
        Then I expect that element "//tr[5]/td " contains the text "<currentIrrigSystems>"
        Then I expect that element "//tr[6]/td " contains the text "<productivityScore>"
        Then I expect that element "//tr[7]/td " contains the text "<waterSharing>"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/business-details"
        When I clear the inputfield "#projectName"
        And I add "Brown Hill Farm reservoir" to the inputfield "#projectName"
        And I add "Kaz Iyiola Limited" to the inputfield "#businessName"
        And I add "50" to the inputfield "#numberEmployees"
        And I add "10000000" to the inputfield "#businessTurnover"
        And I click on the button "#inSbi"
        And I pause for 500ms
        And I add "106651310" to the inputfield "#sbi"
        And I click on Continue button
        And I pause for 500ms
        Then I expect that the url contains "/applying"
        # When I click on the button "applying-2"
        When I click on the agent button
        And I click on Continue button 
        And I pause for 500ms
        Then I expect that the url contains "/agent-details"
        When I clear the inputfield "#firstName"
        And I add "Kaz" to the inputfield "#firstName"
        And I add "Iyiola" to the inputfield "#lastName"
        And I add "Kaz Iyiola Limited" to the inputfield "#businessName"
        And I add "kaz.iyiola@dev.gov.uk" to the inputfield "#email"
        And I add "07777777777" to the inputfield "#mobile"
        And I add "01616666666" to the inputfield "#landline"
        And I add "64 great arbor way, Middleton" to the inputfield "#address1"
        And I add "Manchester" to the inputfield "#address2"
        And I select county name in the dropdown menu   
        And I add "M24 4AU" to the inputfield "#postcode"
        And I click on Continue button 
        And I pause for 500ms
        Then I expect that the url contains "/farmer-details"
        And I add "Ola" to the inputfield "#firstName"
        And I add "Olakaz" to the inputfield "#lastName"
        And I add "kaz.iyiola@dev.gov.uk" to the inputfield "#email"
        And I add "07777555555" to the inputfield "#mobile"
        And I add "01614444444" to the inputfield "#landline"
        And I add "76 Gill Street, Moston" to the inputfield "#address1"
        And I add "Manchester" to the inputfield "#address2"
        And I select county name in the dropdown menu   
        And I add "M9 4FU" to the inputfield "#postcode"
        And I click on Continue button 
        And I pause for 500ms
        Then I expect that the url contains "/check-details"
        And I click on Continue button 
        And I pause for 500ms    
        Then I expect that the url contains "/confirm"
        When I click on the element "#consentOptional"  
        And I click on the button "#btnConfirmSend"
        And I pause for 500ms    
        Then I expect that the url contains "/confirmation"
        # consentOptional
        Examples:
        |cropType      |trades        |permission         |preparatoryWork |projectItems     |SSSI  |licence   |projectSummary            |cropsIrrigated    |hectare_1|hectare_2|waterSource_Current  |waterSource_Target   |irrigationSystem_Current   |irrigationSystem_Target|productivity                        |overllscore|productImpact|currentLandIrrig|currentWaterSource|currentIrrigSystems|productivityScore|waterSharing|
        |#farmingType  |trust         |notNeededPermission|yesPrepWork     |engrFees         | yes  |secured   |improveAndIntroIrrigation |croppingIrrigation|  101    | 200     |RainWater&MainsWaterC|Peakflow&SummerWaterP|currentTrickleAndRain      |plannedMistAndBoom     |maintainProductivity&high-valueCrops|Average    |Average      |Strong          |Average           |Average            |Average          | Strong     |
      #  |#farmingType  |sole          |notNeededPermission|yesPrepWork     |construction     | yes  |notNeeded |changeWater&IncreaseIrrig |cropIrrigation    |  100    | 101     |PeakFlow&MainsWaterC |RainWater&BoreHoleP  |currentMist&Rain           |plannedEbbAndCapillary |increasedYield&improvedQuality      | Average   | Strong      | Strong         | Average          | Average           | Average         | Strong     |
      #  |#farmingType-2|partnership   |secured            |noWorkDoneYet   |overFlow         | no   |secured   |changeWater&ImproveIrrig  |croppingIrrigation|  50     | 50      |PeakFlow&RainWaterC  |SummerWater&BoreHoleP|currentTrickle&Mist        |plannedMistAndEbb      |high-valueCrops&ImprovedQuality     | Weak      | Strong      | Strong         | Weak             | Average           | Average         | Strong     |
  #  |#farmingType-2|charity       |secured            |noWorkDoneYet   |abstractonPump   | no   |notNeeded |improve&IntroIrrigation   |cropIrrigation    |  40     | 41      |PeakFlow&RainWaterC  |BoreHole&MainP       |currentMist&Ebb            |plannedEbbAndSprinklers|high-valueCrops&protectedCrops      | Weak      | Average     | Strong         | Weak             | Average           | Strong          | Weak       |     
     #  |#farmingType  |limitedCompany|notNeededPermission|yesPrepWork     |syntheticliner   | yes  |secured   |intro&increaseIrrigation  |fruitIrrigation   |  30     | 70      |PeakFlow&RainWaterC  |SummerWater&MainP    |currentEbbAndSprinklers    |plannedSprinklers&Capi |maintainProductivity&high-valueCrops| Weak      | Weak        | Strong         | Weak             | Average           | Average         | Strong     |
    #   |#farmingType-2|liaPartnership|secured            |noWorkDoneYet   |synLinedReservoir| no   |secured   |improve&IncreaseIrrigation|fruitIrrigation   |  30     | 40      |RainWater&BoreHoleC  |SummerWater&BoreHoleP|currentSprinklers&Capillary|plannedBoom&Capillary  |improvedQuality&maintainProductivity| Weak      | Average     | Strong         | Weak             | Average           | Weak            | Weak       |
    #   |#farmingType  |communityInt  |notNeededPermission|yesPrepWork     |filtrationEquip  | yes  |notNeeded |increaseIrrigation        |cropIrrigation    |  45     | 67      |PeakFlow&RainWaterC  |Peakflow&MainP       |currentBoom&Capillary      |plannedBoom&Rain       |improvedQuality                     | Weak      | Weak        | Strong         | Weak             | Weak              | Weak            | Strong     |    
     #  |#farmingType-2|ltdPartnership|secured            |noWorkDoneYet   |irrigationPump   | no   |notNeeded |improveIrrigation         |croppingIrrigation|  22     | 44      |PeakFlow&RainWaterC  |Peakflow&RainWaterP  |currentBoom&Rain           |plannedRain&Trickle    |protectedCrops                      | Strong    | Weak        | Strong         | Strong           | Average           | Average         | Weak       |    
     #  |#farmingType  |industrialSty |notNeededPermission|yesPrepWork     |pipeWork         | yes  |secured   |changeWater               |fruitIrrigation   |  10     | 500     |currentPeakFlow      |plannedRainWater     |currentBoom                |plannedTrickle         |high-valueCrops                     |
     #  |#farmingType-2|coopSociety   |secured            |noWorkDoneYet   |pumpHouse        | no   |notNeeded |increaseIrrigation        |cropIrrigation    |  20     | 21      |SummerWater&Main     |Peakflow&BoreHole    |currentBoom&Capillary      |plannedTrickle&Mist    |increasedYield&improvedQuality      |
     #  |#farmingType  |BenCom        |notNeededPermission|yesPrepWork     |undergroundWater | yes  |notNeeded |increaseIrrigation        |croppingIrrigation|  50     | 51      |currentPeakFlow      |plannedPeakFlow      |currentBoom                |plannedRain            |high-valueCrops                     |                    
     #  |#farmingType-2|sole          |secured            |noWorkDoneYet   |electInstallation| no   |secured   |increaseIrrigation        |fruitIrrigation   |  10     | 10      |currentMainsWater    |plannedPeakFlow      |currentRain                |plannedBoom            |high-valueCrops                     |
     #  |#farmingType  |partnership   |notNeededPermission|yesPrepWork     |boom             | yes  |notNeeded |introduceIrrigation       |cropIrrigation    |  20     | 20      |currentMainsWater    |plannedPeakFlow      |currentRain                |plannedRain            |protectedCrops                      |
     #  |#farmingType-2|limitedCompany|secured            |noWorkDoneYet   |trickle          | no   |secured   |changeWater               |croppingIrrigation|  5      |  5      |currentMainsWater    |plannedRainWater     |currentEbb                 |plannedEbb             |maintainProductivity                |
     #  |#farmingType  |charity       |notNeededPermission|yesPrepWork     |ebbAndFlow       | yes  |notNeeded |changeWater               |fruitIrrigation   |  15     | 15      |currentSummerWater   |plannedPeakFlow      |currentRain                |plannedRain            |maintainProductivity                |
     #  |#farmingType-2|trust         |secured            |noWorkDoneYet   |capillaryBed     | no   |secured   |changeWater               |cropIrrigation    |  5      |  5      |currentSummerWater   |plannedPeakFlow      |currentRain                |plannedRain            |maintainProductivity                |
     #  |#farmingType  |liaPartnership|notNeededPermission|yesPrepWork     |sprinklers       | no   |notNeeded |changeWater               |croppingIrrigation|  15     | 15      |currentBoreHole      |plannedPeakFlow      |currentTrickle             |plannedTrickle         |maintainProductivity                |
     #  |#farmingType-2|communityInt  |secured            |noWorkDoneYet   |mist             | yes  |secured   |changeWater               |fruitIrrigation   |  20     | 20      |currentSummerWater   |Peakflow&SummerWaterP|currentBoom                |plannedBoom            |maintainProductivity                |
    # 
        