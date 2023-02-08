import clearInputField from '../support/action/clearInputField'
import clickElement from '../support/action/clickElement'
import closeLastOpenedWindow from '../support/action/closeLastOpenedWindow'
import deleteCookies from '../support/action/deleteCookies'
import dragElement from '../support/action/dragElement'
import focusLastOpenedWindow from '../support/action/focusLastOpenedWindow'
import handleModal from '../support/action/handleModal'
import moveTo from '../support/action/moveTo'
import pause from '../support/action/pause'
import pressButton from '../support/action/pressButton'
import scroll from '../support/action/scroll'
import selectOption from '../support/action/selectOption'
import selectOptionByIndex from '../support/action/selectOptionByIndex'
import setCookie from '../support/action/setCookie'
import setInputField from '../support/action/setInputField'
import setPromptText from '../support/action/setPromptText'
import Start from '../pageobjects/ffc-grant-start'
import FarmingType from '../pageobjects/ffc-grant-farmingtype'
import LegalStatus from '../pageobjects/ffc-grant-legal-status'
import Country from '../pageobjects/ffc-grant-country'
import PermissionPlanning from '../pageobjects/ffc-grant-permission-planning'
import ProjectStart from '../pageobjects/ffc-grant-project-start'
import Tenancy from '../pageobjects/ffc-grant-tenancy'
import ProjectItems from '../pageobjects/ffc-grant-project-items'
// import ProjectCost from '../pageobjects/ffc-grant-project-cost'
// import PotentialAmount from '../pageobjects/ffc-grant-potential-amount'
import RemainingCosts from '../pageobjects/ffc-grant-remaing-cost'
import SSSI from '../pageobjects/ffc-grant-sssi'
import Licence from '../pageobjects/ffc-grant-abstraction-licence'
import ProjectSummary from '../pageobjects/ffc-grant-project-summary'
import IrrigatedCrops from '../pageobjects/ffc-grant-irrigated-crops'
import IrrigationStatus from '../pageobjects/ffc-grant-irrigation-status'
// import IrrigatedLand from '../pageobjects/ffc-grant-irrigated-land'
import WaterSource from '../pageobjects/ffc-grant-water-source'
import IrrigationSystem from '../pageobjects/ffc-grant-irrigation-systems'
import Productivity from '../pageobjects/ffc-grant-productivity'
import AgentDetails from '../pageobjects/ffc-grant-agent-details'
import Applying from '../pageobjects/ffc-grant-applying'
import Collaboration from '../pageobjects/ffc-grant-collaboration'
import CheckDetails from '../pageobjects/ffc-grant-check-details'

// import Propertytype from '../pageobjects/ffc-demo-property-type'
// import ClaimName from '../pageobjects/ffc-demo-claimname'
// import PropertyAccessible from '../pageobjects/ffc-demo-property-accessible'
// import PropertyMineType from '../pageobjects/ffc-demo-mine-type'

const { When } = require('cucumber')

When(/^I click on the reject cookies$/, function () {
  Start.clickOnRejectCookies()
})

When(
  /^I (click|doubleclick) on the (link|button|element) "([^"]*)?"$/,
  clickElement
)

When(
  /^I (click) on start new calculator (button) "([^"]*)?"$/,
  clickElement
)

When(/^I clicks on the button$/, function () {
  FarmingType.clickOnCropFarmingType()
})

When(/^I clicks on the sole trade button$/, function () {
  LegalStatus.clickOnSoleTrade()
})

When(/^I clicks on the "([^"]*)?" button$/, function (trades) {
  if (trades === 'sole') {
    LegalStatus.clickOnSoleTrade()
    console.log(trades)
  } else if (trades === 'partnership') {
    LegalStatus.clickOnPartnership()
  } else if (trades === 'limitedCompany') {
    LegalStatus.clickOnLimitedCompany()
  } else if (trades === 'charity') {
    LegalStatus.clickOnCharity()
  } else if (trades === 'trust') {
    LegalStatus.clickOnTrust()
  } else if (trades === 'liaPartnership') {
    LegalStatus.clickOnLimitedLiabilityPartnership()
  } else if (trades === 'communityInt') {
    LegalStatus.clickOnCommunityInterestCompany()
  } else if (trades === 'ltdPartnership') {
    LegalStatus.clickOnLimitedLiabilityPartnership()
  } else if (trades === 'industrialSty') {
    LegalStatus.clickOnIndustrialAndProvidentSociety()
  } else if (trades === 'coopSociety') {
    LegalStatus.clickOnCooperativeSociety()
  } else if (trades === 'BenCom') {
    LegalStatus.clickOnCommunityBenefitSociety()
  } else if (trades === 'NoneOfTheAbove') {
    LegalStatus.clickOnNoneOfTheAbove()
  }
})

When(/^I click on the limited company button$/, function () {
  LegalStatus.clickOnLimitedCompany()
})

When(/^I click on CountryYes button$/, function () {
  Country.clickOnCtyYesButton()
})

When(/^I click on CountryNo button$/, function () {
  Country.clickOnCtyNoButton()
})

When(/^I click on secured button$/, function () {
  PermissionPlanning.clickOnSecured()
})

When(/^I click on not needed permission button$/, function () {
  PermissionPlanning.clickOnNotNeededPermission()
})

When(/^I click on "([^"]*)?" button$/, function (permission) {
  if (permission === 'notNeededPermission') {
    PermissionPlanning.clickOnNotNeededPermission()
    console.log(permission)
  } else if (permission === 'secured') {
    PermissionPlanning.clickOnSecured()
  }
})

When(/^I click on Yes preparatory work button$/, function () {
  ProjectStart.clickOnYesPrepWork()
})

When(/^I click "([^"]*)?" button$/, function (preparatoryWork) {
  if (preparatoryWork === 'yesPrepWork') {
    ProjectStart.clickOnYesPrepWork()
    console.log(preparatoryWork)
  } else if (preparatoryWork === 'noWorkDoneYet') {
    ProjectStart.clickOnNoProjectYet()
  }
})

When(/^I click on yes land ownership button$/, function () {
  Tenancy.clickOnYesLandOwnership()
})

When(/^I click on project items buttons$/, function () {
  ProjectItems.clickOnconstruction()
})

When(/^I clicks "([^"]*)?" buttons$/, function (projectItems) {
  if (projectItems === 'construction') {
    ProjectItems.clickOnconstruction()
    console.log(projectItems)
  } else if (projectItems === 'overFlow') {
    ProjectItems.clickOnOverflow()
  } else if (projectItems === 'syntheticliner') {
    ProjectItems.clickOnsynLiner()
  } else if (projectItems === 'abstractonPump') {
    ProjectItems.clickOnAbstractonPump()
  } else if (projectItems === 'engrFees') {
    ProjectItems.clickOnEngrFees()
  } else if (projectItems === 'synLinedReservoir') {
    ProjectItems.clickOnSynLinedReservoir()
  } else if (projectItems === 'filtrationEquip') {
    ProjectItems.clickOnFiltrationEquip()
  } else if (projectItems === 'irrigationPump') {
    ProjectItems.clickOnIrrigationPump()
  } else if (projectItems === 'pipeWork') {
    ProjectItems.clickOnsynLiner()
  } else if (projectItems === 'pumpHouse') {
    ProjectItems.clickOnPumpHouse()
  } else if (projectItems === 'undergroundWater') {
    ProjectItems.clickOnUndergroundWater()
  } else if (projectItems === 'electInstallation') {
    ProjectItems.clickOnElectInstallation()
  } else if (projectItems === 'waterMeter') {
    ProjectItems.clickOnWaterMeter()
  } else if (projectItems === 'boom') {
    ProjectItems.clickOnBoom()
  } else if (projectItems === 'trickle') {
    ProjectItems.clickOnTrickle()
  } else if (projectItems === 'ebbAndFlow') {
    ProjectItems.clickOnEbbAndFlow()
  } else if (projectItems === 'capillaryBed') {
    ProjectItems.clickOnCapillaryBed()
  } else if (projectItems === 'sprinklers') {
    ProjectItems.clickOnSprinklers()
  } else if (projectItems === 'mist') {
    ProjectItems.clickOnMist()
  } else if (projectItems === 'softMonitor') {
    ProjectItems.clickOnSoftMonitor()
  } else if (projectItems === 'softSensor') {
    ProjectItems.clickOnSoftSensor()
  }
})

When(/^I click on remaining cost buttons$/, function () {
  RemainingCosts.clickOnYesRemainingCost()
})

When(/^I click the "([^"]*)?" buttons$/, function (remainingCost) {
  if (remainingCost === 'yes') {
    RemainingCosts.clickOnYesRemainingCost()
    console.log(remainingCost)
  } else if (remainingCost === 'no') {
    RemainingCosts.clickOnNoRemainingCost()
  }
})

When(/^I click on SSSI button$/, function () {
  SSSI.clickOnYesSSSI()
})

When(/^I click the "([^"]*)?" button$/, function (sssi) {
  if (sssi === 'yes') {
    SSSI.clickOnYesSSSI()
    console.log(sssi)
  } else if (sssi === 'no') {
    SSSI.clickOnNoSSSI()
  }
})

When(/^I click on abstraction licence button$/, function () {
  Licence.clickOnNotNeededLicense()
})

When(/^I click on abstraction "([^"]*)?" button$/, function (licence) {
  if (licence === 'notNeeded') {
    Licence.clickOnNotNeededLicense()
    console.log(licence)
  } else if (licence === 'secured') {
    Licence.clickOnSecured()
  } else if (licence === 'expectToHaveLicence') {
    Licence.clickOnExpectToHaveLicence()
  } else if (licence === 'notHaveLicence') {
    Licence.clickOnWillNotHaveLicence()
  }
})

When(/^I click on project impact button$/, function () {
  ProjectSummary.clickOnChangeWater()
})

When(/^I click on project "([^"]*)?" button$/, function (projectSummary) {
  if (projectSummary === 'changeWater') {
    ProjectSummary.clickOnChangeWater()
    console.log(projectSummary)
  } else if (projectSummary === 'improveIrrigation') {
    ProjectSummary.clickOnImproveIrrigation()
  } else if (projectSummary === 'increaseIrrigation') {
    ProjectSummary.clickOnIncreaseIrrigation()
  } else if (projectSummary === 'introduceIrrigation') {
    ProjectSummary.clickOnIntroduceIrrigation()
  } else if (projectSummary === 'improveAndIntroIrrigation') {
    ProjectSummary.clickOnImproveIrrigation()
    ProjectSummary.clickOnIntroduceIrrigation()
  } else if (projectSummary === 'changeWater&IncreaseIrrig') {
    ProjectSummary.clickOnChangeWater()
    ProjectSummary.clickOnIncreaseIrrigation()
  } else if (projectSummary === 'changeWater&ImproveIrrig') {
    ProjectSummary.clickOnChangeWater()
    ProjectSummary.clickOnImproveIrrigation()
  } else if (projectSummary === 'intro&increaseIrrigation') {
    ProjectSummary.clickOnIntroduceIrrigation()
    ProjectSummary.clickOnIncreaseIrrigation()
  } else if (projectSummary === 'improve&IncreaseIrrigation') {
    ProjectSummary.clickOnImproveIrrigation()
    ProjectSummary.clickOnIncreaseIrrigation()
  } else if (projectSummary === 'changeWater&IncreaseIrrig&IntroIrrigation') {
    ProjectSummary.clickOnChangeWater()
    ProjectSummary.clickOnIncreaseIrrigation()
    ProjectSummary.clickOnIntroduceIrrigation()
  } else if (projectSummary === 'noneOfTheAbove') {
    ProjectSummary.clickOnNoneIrrigation()
  }
})

When(/^I click on crops irrigated button$/, function () {
  IrrigatedCrops.clickOnCropIrrigation()
})

When(/^I click on crops "([^"]*)?" button$/, function (cropsIrrigated) {
  if (cropsIrrigated === 'cropIrrigation') {
    IrrigatedCrops.clickOnCropIrrigation()
    console.log(cropsIrrigated)
  } else if (cropsIrrigated === 'croppingIrrigation') {
    IrrigatedCrops.clickOnCroppingIrrigation()
  } else if (cropsIrrigated === 'fruitIrrigation') {
    IrrigatedCrops.clickOnFruitIrrigation()
  }
})

When(/^I click on irrigation status button$/, function () {
  IrrigationStatus.clickOnYesIrrigationStatus()
})

When(/^I click on the irrigation "([^"]*)?" button$/, function (status) {
  if (status === 'yes') {
    IrrigationStatus.clickOnYesIrrigationStatus()
    console.log(status)
  } else if (status === 'no') {
    IrrigationStatus.clickOnNoIrrigationStatus()
  }
})

// When(/^I click on irrigation status button$/, function () {
//   IrrigationStatus.clickOnYesIrrigationStatus()
// })

When(/^I click on irrigation water source button$/, function () {
  WaterSource.clickOnCurrentPeakFlow()
})

When(/^I click irrigation "([^"]*)?" button$/, function (waterSource) {
  if (waterSource === 'currentPeakFlow') {
    WaterSource.clickOnCurrentPeakFlow()
    console.log(waterSource)
  } else if (waterSource === 'currentBoreHole') {
    WaterSource.clickOnCurrentBoreHole()
  } else if (waterSource === 'currentRainWater') {
    WaterSource.clickOnCurrentRainWater()
  } else if (waterSource === 'currentSummerWater') {
    WaterSource.clickOnCurrentSummerWater()
  } else if (waterSource === 'currentMainsWater') {
    WaterSource.clickOnCurrentMainsWater()
  } else if (waterSource === 'plannedPeakFlow') {
    WaterSource.clickOnPlannedPeakFlow()
  } else if (waterSource === 'plannedBoreHole') {
    WaterSource.clickOnPlannedBoreHole()
  } else if (waterSource === 'plannedRainWater') {
    WaterSource.clickOnPlannedRainWater()
  } else if (waterSource === 'plannedSummerWater') {
    WaterSource.clickOnPlannedSummerWater()
  } else if (waterSource === 'plannedMainsWater') {
    WaterSource.clickOnPlannedMainsWater()
  } else if (waterSource === 'RainWater&MainsWaterC') {
    WaterSource.clickOnCurrentRainWater()
    WaterSource.clickOnCurrentMainsWater()
  } else if (waterSource === 'PeakFlow&MainsWaterC') {
    WaterSource.clickOnCurrentPeakFlow()
    WaterSource.clickOnCurrentMainsWater()
  } else if (waterSource === 'PeakFlow&RainWaterC') {
    WaterSource.clickOnCurrentPeakFlow()
    WaterSource.clickOnCurrentRainWater()
  } else if (waterSource === 'RainWater&BoreHoleC') {
    WaterSource.clickOnCurrentRainWater()
    WaterSource.clickOnCurrentBoreHole()
  } else if (waterSource === 'Peakflow&SummerWaterP') {
    WaterSource.clickOnPlannedPeakFlow()
    WaterSource.clickOnPlannedSummerWater()
  } else if (waterSource === 'RainWater&BoreHoleP') {
    WaterSource.clickOnPlannedRainWater()
    WaterSource.clickOnPlannedBoreHole()
  } else if (waterSource === 'SummerWater&BoreHoleP') {
    WaterSource.clickOnPlannedSummerWater()
    WaterSource.clickOnPlannedBoreHole()
  } else if (waterSource === 'BoreHole&MainP') {
    WaterSource.clickOnPlannedBoreHole()
    WaterSource.clickOnPlannedMainsWater()
  } else if (waterSource === 'SummerWater&MainP') {
    WaterSource.clickOnPlannedSummerWater()
    WaterSource.clickOnPlannedMainsWater()
  } else if (waterSource === 'Peakflow&MainP ') {
    WaterSource.clickOnPlannedPeakFlow()
    WaterSource.clickOnPlannedMainsWater()
  } else if (waterSource === 'Peakflow&RainWaterP') {
    WaterSource.clickOnPlannedPeakFlow()
    WaterSource.clickOnPlannedRainWater()
  } else if (waterSource === 'Peakflow&BoreHole') {
    WaterSource.clickOnPlannedPeakFlow()
    WaterSource.clickOnPlannedBoreHole()
  }
})

When(/^I click on irrigation "([^"]*)?" button$/, function (irrigationSystem) {
  // IrrigationSystem.clickOnCurrentBoom()
  // IrrigationSystem.clickOnPlannedBoom()

  if (irrigationSystem === 'currentBoom') {
    IrrigationSystem.clickOnCurrentBoom()
    console.log(irrigationSystem)
  } else if (irrigationSystem === 'currentCapillary') {
    IrrigationSystem.clickOnCurrentCapillary()
  } else if (irrigationSystem === 'currentEbb') {
    IrrigationSystem.clickOnCurrentEbb()
  } else if (irrigationSystem === 'currentMist') {
    IrrigationSystem.clickOnCurrentMist()
  } else if (irrigationSystem === 'currentRain') {
    IrrigationSystem.clickOnCurrentRain()
  } else if (irrigationSystem === 'currentSprinklers') {
    IrrigationSystem.clickOnCurrentSprinklers()
  } else if (irrigationSystem === 'currentTrickle') {
    IrrigationSystem.clickOnCurrentTrickle()
  } else if (irrigationSystem === 'plannedBoom') {
    IrrigationSystem.clickOnPlannedBoom()
  } else if (irrigationSystem === 'plannedCapillary') {
    IrrigationSystem.clickOnPlannedCapillary()
  } else if (irrigationSystem === 'plannedEbb') {
    IrrigationSystem.clickOnPlannedEbb()
  } else if (irrigationSystem === 'plannedMist') {
    IrrigationSystem.clickOnPlannedMist()
  } else if (irrigationSystem === 'plannedRain') {
    IrrigationSystem.clickOnPlannedRain()
  } else if (irrigationSystem === 'plannedSprinklers') {
    IrrigationSystem.clickOnPlannedSprinklers()
  } else if (irrigationSystem === 'plannedTrickle') {
    IrrigationSystem.clickOnPlannedTrickle()
  } else if (irrigationSystem === 'currentTrickleAndRain') {
    IrrigationSystem.clickOnCurrentTrickle()
    IrrigationSystem.clickOnCurrentRain()
  } else if (irrigationSystem === 'currentMist&Rain') {
    IrrigationSystem.clickOnCurrentMist()
    IrrigationSystem.clickOnCurrentRain()
  } else if (irrigationSystem === 'currentTrickle&Mist') {
    IrrigationSystem.clickOnCurrentTrickle()
    IrrigationSystem.clickOnCurrentMist()
  } else if (irrigationSystem === 'currentMist&Ebb') {
    IrrigationSystem.clickOnCurrentMist()
    IrrigationSystem.clickOnCurrentEbb()
  } else if (irrigationSystem === 'currentEbbAndSprinklers') {
    IrrigationSystem.clickOnCurrentEbb()
    IrrigationSystem.clickOnCurrentSprinklers()
  } else if (irrigationSystem === 'currentSprinklers&Capillary') {
    IrrigationSystem.clickOnCurrentSprinklers()
    IrrigationSystem.clickOnCurrentCapillary()
  } else if (irrigationSystem === 'currentBoom&Capillary') {
    IrrigationSystem.clickOnCurrentBoom()
    IrrigationSystem.clickOnCurrentCapillary()
  } else if (irrigationSystem === 'currentBoom&Rain') {
    IrrigationSystem.clickOnCurrentBoom()
    IrrigationSystem.clickOnCurrentRain()
  } else if (irrigationSystem === 'plannedMistAndBoom') {
    IrrigationSystem.clickOnPlannedMist()
    IrrigationSystem.clickOnPlannedBoom()
  } else if (irrigationSystem === 'plannedEbbAndCapillary') {
    IrrigationSystem.clickOnPlannedEbb()
    IrrigationSystem.clickOnPlannedCapillary()
  } else if (irrigationSystem === 'plannedMistAndEbb') {
    IrrigationSystem.clickOnPlannedMist()
    IrrigationSystem.clickOnPlannedEbb()
  } else if (irrigationSystem === 'plannedEbbAndSprinklers') {
    IrrigationSystem.clickOnPlannedEbb()
    IrrigationSystem.clickOnPlannedSprinklers()
  } else if (irrigationSystem === 'plannedSprinklers&Capi') {
    IrrigationSystem.clickOnPlannedSprinklers()
    IrrigationSystem.clickOnPlannedCapillary()
  } else if (irrigationSystem === 'plannedBoom&Capillary') {
    IrrigationSystem.clickOnPlannedBoom()
    IrrigationSystem.clickOnPlannedCapillary()
  } else if (irrigationSystem === 'plannedBoom&Rain') {
    IrrigationSystem.clickOnPlannedBoom()
    IrrigationSystem.clickOnPlannedRain()
  } else if (irrigationSystem === 'plannedRain&Trickle') {
    IrrigationSystem.clickOnPlannedRain()
    IrrigationSystem.clickOnPlannedTrickle()
  } else if (irrigationSystem === 'plannedTrickle&Mist') {
    IrrigationSystem.clickOnPlannedTrickle()
    IrrigationSystem.clickOnPlannedMist()
  }
})

When(/^I click on irrigation system button$/, function () {
  IrrigationSystem.clickOnCurrentBoom()
  IrrigationSystem.clickOnPlannedBoom()
})

When(/^I click on project improve productivity button$/, function () {
  Productivity.clickOnproductivity1()
})

When(/^I click on project improve "([^"]*)?" button$/, function (productivity) {
  if (productivity === 'high-valueCrops') {
    Productivity.clickOnproductivity1()
    console.log(productivity)
  } else if (productivity === 'protectedCrops') {
    Productivity.clickOnproductivity2()
  } else if (productivity === 'increasedYield') {
    Productivity.clickOnproductivity3()
  } else if (productivity === 'improvedQuality') {
    Productivity.clickOnproductivity4()
  } else if (productivity === 'maintainProductivity') {
    Productivity.clickOnproductivity5()
  } else if (productivity === 'maintainProductivity&high-valueCrops') {
    Productivity.clickOnproductivity5()
    Productivity.clickOnproductivity1()
  } else if (productivity === 'increasedYield&improvedQuality') {
    Productivity.clickOnproductivity3()
    Productivity.clickOnproductivity4()
  } else if (productivity === 'high-valueCrops&ImprovedQuality') {
    Productivity.clickOnproductivity1()
    Productivity.clickOnproductivity4()
  } else if (productivity === 'high-valueCrops&protectedCrops') {
    Productivity.clickOnproductivity1()
    Productivity.clickOnproductivity2()
  } else if (productivity === 'improvedQuality&maintainProductivity') {
    Productivity.clickOnproductivity4()
    Productivity.clickOnproductivity5()
  } else if (productivity === 'select3Productivity') {
    Productivity.clickOnproductivity1()
    Productivity.clickOnproductivity2()
    Productivity.clickOnproductivity3()
  }
})

When(/^I click on the water supply "([^"]*)?" button$/, function (waterSharing) {
  if (waterSharing === 'yes') {
    Collaboration.clickOnYesCollaboration()
    console.log(waterSharing)
  } else if (waterSharing === 'no') {
    Collaboration.clickOnNoCollaboration()
  }
})

When(/^I click on the agent button$/, function () {
  Applying.clickOnAgentRadioBtn()
})

When(/^I select county name in the dropdown menu$/, function () {
  AgentDetails.clickOnCountyDropMenu()
})

When(/^I click on the business-details link$/, async () => {
  CheckDetails.clickOnBusinessDetailsLink()
})

// When(/^I click on Continue button$/, async () => {
//   FarmingType.clickOnSaveandContinueButton2()
// })

// When(/^I click on irrigation status button$/, function () {
//   IrrigationStatus.clickOnYesIrrigationStatus()
// })

// When(/^I click on CountryYes button$/, function () {
//   Country.ctyYes()
// })

// When(/^I clicks on the button$/, function () {
//   FarmingType.clickOnCropFarmingType()
// })

// When(/^I click on Continue button$/, function () {
//   FarmingType.clickOnSaveandContinueButton()
// })

When(/^I click on Continue button$/, async () => {
  FarmingType.clickOnSaveandContinueButton2()
})

// When(/^I click on the search link$/, async () => {
//   Parcel.clickOnSearchLink()
// });

// When(/^I click on the yes accessibilty button$/, function () {
//   PropertyAccessible.selectYesRadioButton()
// })

// When(/^I click on the coal mine checkbox$/, function () {
//   PropertyMineType.selectCoalCheckBox()
// })

// When(
//   /^I input claim name$/, async () => {
//     await ClaimName.claimNameInput()
//   }
// )

When(
  /^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/,
  setInputField
)

When(
  /^I clear the inputfield "([^"]*)?"$/,
  clearInputField
)

When(
  /^I drag element "([^"]*)?" to element "([^"]*)?"$/,
  dragElement
)

When(
  /^I pause for (\d+)ms$/,
  pause
)

When(
  /^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/,
  setCookie
)

When(
  /^I delete the cookie "([^"]*)?"$/,
  deleteCookies
)

When(
  /^I press "([^"]*)?"$/,
  pressButton
)

When(
  /^I (accept|dismiss) the (alertbox|confirmbox|prompt)$/,
  handleModal
)

When(
  /^I enter "([^"]*)?" into the prompt$/,
  setPromptText
)

When(
  /^I scroll to element "([^"]*)?"$/,
  scroll
)

When(
  /^I close the last opened (window|tab)$/,
  closeLastOpenedWindow
)

When(
  /^I focus the last opened (window|tab)$/,
  focusLastOpenedWindow
)

When(
  /^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/,
  selectOptionByIndex
)

When(
  /^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/,
  selectOption
)

When(
  /^I move to element "([^"]*)?"(?: with an offset of (\d+),(\d+))*$/,
  moveTo
)
