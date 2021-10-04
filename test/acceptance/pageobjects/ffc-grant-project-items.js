import Page from './page'

class ProjectItems extends Page {
  /**
      * define elements for reservoir construction
      */

  get constructn () { return $('#projectInfrastucture') }
  get overflow () { return $('#projectInfrastucture-2') }
  get synLiner () { return $('#projectInfrastucture-3') }
  get abstractPoint () { return $('#projectInfrastucture-4') }
  get engrFees () { return $('#projectInfrastucture-5') }
  get fencing () { return $('#projectInfrastucture-6') }
  get filtratnEqiup () { return $('#projectInfrastucture-8') }
  get IrrigPump () { return $('#projectInfrastucture-9') }
  get reservoir () { return $('#projectInfrastucture-10') }
  get pumpHouse () { return $('#projectInfrastucture-11') }
  get hydrant () { return $('#projectInfrastucture-12') }
  get electInst () { return $('#projectInfrastucture-13') }
  get waterMeter () { return $('#projectInfrastucture-14') }

  // define elements for Irrigation equipment
  get boom () { return $('#projectEquipment') }
  get trickle () { return $('#projectEquipment-2') }
  get ebb () { return $('#projectEquipment-3') }
  get capillary () { return $('#projectEquipment-4') }
  get sprinkler () { return $('#projectEquipment-5') }
  get mist () { return $('#projectEquipment-6') }

  // define elements for Technology
  get softMonitor () { return $('#projectTechnology') }
  get softSensor () { return $('#projectTechnology-2') }

  /**
       * define or overwrite page methods
       */
  open () {
    super.open('')
    browser.pause(3000)
  }
  /**
       * your page specific methods
       */

  clickOnconstruction () {
    const element = $('#projectInfrastucture')
    browser.execute('arguments[0].click();', element)
  }

  clickOnOverflow () {
    const element = $('#projectInfrastucture-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnsynLiner () {
    const element = $('#projectInfrastucture-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnAbstractonPump () {
    const element = $('#projectInfrastucture-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnEngrFees () {
    const element = $('#projectInfrastucture-5')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSynLinedReservoir () {
    const element = $('#projectInfrastucture-6')
    browser.execute('arguments[0].click();', element)
  }

  clickOnFiltrationEquip () {
    const element = $('#projectInfrastucture-7')
    browser.execute('arguments[0].click();', element)
  }

  clickOnIrrigationPump () {
    const element = $('#projectInfrastucture-8')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPipeWork () {
    const element = $('#projectInfrastucture-9')
    browser.execute('arguments[0].click();', element)
  }

  clickOnPumpHouse () {
    const element = $('#projectInfrastucture-10')
    browser.execute('arguments[0].click();', element)
  }

  clickOnUndergroundWater () {
    const element = $('#projectInfrastucture-11')
    browser.execute('arguments[0].click();', element)
  }

  clickOnElectInstallation () {
    const element = $('#projectInfrastucture-12')
    browser.execute('arguments[0].click();', element)
  }

  clickOnWaterMeter () {
    const element = $('#projectInfrastucture-13')
    browser.execute('arguments[0].click();', element)
  }

  // projectEquipment

  clickOnBoom () {
    const element = $('#projectEquipment')
    browser.execute('arguments[0].click();', element)
  }

  clickOnTrickle () {
    const element = $('#projectEquipment-2')
    browser.execute('arguments[0].click();', element)
  }

  clickOnEbbAndFlow () {
    const element = $('#projectEquipment-3')
    browser.execute('arguments[0].click();', element)
  }

  clickOnCapillaryBed () {
    const element = $('#projectEquipment-4')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSprinklers () {
    const element = $('#projectEquipment-5')
    browser.execute('arguments[0].click();', element)
  }

  clickOnMist () {
    const element = $('#projectEquipment-6')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSoftMonitor () {
    const element = $('#projectTechnology')
    browser.execute('arguments[0].click();', element)
  }

  clickOnSoftSensor () {
    const element = $('#projectTechnology-2')
    browser.execute('arguments[0].click();', element)
  }
}
export default new ProjectItems()
