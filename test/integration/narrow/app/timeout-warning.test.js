// mock dialog-polyfill
jest.mock('dialog-polyfill', () => ({
    registerDialog: jest.fn((param) => null)
}))
const dialogPolyfill = require('dialog-polyfill')
  
  // mock module object - parameter of constructor TimeoutWarning
let mockModule = {
  querySelector: jest.fn((param) => (`mqs_${param}`)),
  getAttribute: jest.fn((param) => null)
}
const origMockModule = mockModule

  // mock document & window - DOM global values
const { JSDOM } = require('jsdom')
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window
global.HTMLDialogElement = dom.window.HTMLDialogElement
global.navigator = dom.window.navigator
  
  // import TimeoutWarning
const TimeoutWarning = require('../../../../app/templates/components/timeout-warning/timeout-warning')

describe('Timeout Warning', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks()
    TimeoutWarning.close()
  })
  
  xit('test TimeoutWarning constructor', () => {
    expect(TimeoutWarning).toBeDefined()

    jest.spyOn(document, 'querySelector').mockImplementation((param) => (`dqs_${param}`))

    expect(new TimeoutWarning(mockModule)).toEqual({
      $module: mockModule,
      $lastFocusedEl: null,
      $closeButton: 'mqs_.js-dialog-close',
      $cancelButton: 'mqs_.js-dialog-cancel',
      overLayClass: 'govuk-timeout-warning-overlay',
      $fallBackElement: 'dqs_.govuk-timeout-warning-fallback',
      timers: [],
      $countdown: 'mqs_.timer',
      $accessibleCountdown: 'mqs_.at-timer',
      idleMinutesBeforeTimeOut: 25,
      timeOutRedirectUrl: 'timeout',
      minutesTimeOutModalVisible: 5,
      timeUserLastInteractedWithPage: ''
    })

    mockModule.getAttribute.mockImplementation((param) => {
      switch (param) {
        case 'data-minutes-idle-timeout':
          return 15
        case 'data-url-redirect':
          return 'mock-back-url'
        case 'data-minutes-modal-visible':
          return 10
        default:
          return null
      }
    })

    expect(new TimeoutWarning(mockModule)).toEqual(
      expect.objectContaining({
        idleMinutesBeforeTimeOut: 15,
        timeOutRedirectUrl: 'mock-back-url',
        minutesTimeOutModalVisible: 10
      })
    )
  })

  it('test TimeoutWarning.dialogSupported()', () => {
    global.HTMLDialogElement = jest.fn(() => {})

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      classList: {
        add: (addParam) => null
      }
    }))

    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(true)

    global.HTMLDialogElement = {}
    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(true)

    dialogPolyfill.registerDialog.mockImplementation((param) => { throw Error('mock-error') })
    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(false)
  })

  xit('test TimeoutWarning.init()', () => {
    dialogPolyfill.registerDialog.mockImplementation((param) => { throw Error('mock-error') })
    expect(new TimeoutWarning(mockModule).init()).toBe(undefined)

    global.HTMLDialogElement = jest.fn(() => {})
    mockModule = {
      ...mockModule,
      querySelector: jest.fn((paramA) => ({
        addEventListener: jest.fn((paramB) => {})
      })),
      addEventListener: jest.fn((paramC) => {})
    }
    expect(new TimeoutWarning(mockModule).init()).toBe(undefined)

    mockModule = origMockModule
  })

  it('test TimeoutWarning.countIdleTime()', () => {
    expect(new TimeoutWarning(mockModule).countIdleTime()).toBe(undefined)
  })

  xit('test TimeoutWarning.openDialog()', () => {
    mockModule = {
      ...mockModule,
      open: 'mock-module-open'
    }
    expect(new TimeoutWarning(mockModule).openDialog()).toBe(undefined)

    mockModule = origMockModule

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      classList: {
        add: (addParam) => null
      },
      setAttribute: (paramA, paramB) => {}
    }))

    mockModule = {
      ...mockModule,
      showModal: jest.fn(() => {})
    }

    const result = new TimeoutWarning(mockModule)
    expect(result.openDialog()).toBe(undefined)
    result.clearTimers()
  })

  xit('test TimeoutWarning.startUiCountdown()', () => {
    global.navigator.userAgent = ''

    let result

    mockModule = {
      ...mockModule,
      getAttribute: jest.fn((param) => 1)
    }
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule = {
      ...mockModule,
      querySelector: jest.fn((paramA) => ({
        setAttribute: jest.fn((paramB, paramC) => {})
      })),
      getAttribute: jest.fn((param) => 0)
    }
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (1))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (0.15))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (2))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (2.15))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    global.navigator = dom.window.navigator
    mockModule = origMockModule
  })

  it('test TimeoutWarning.saveLastFocusedEl()', () => {
    jest.spyOn(document, 'querySelector').mockImplementation((param) => ('mock-dqs'))

    let result = new TimeoutWarning(mockModule)
    expect(result.saveLastFocusedEl()).toBe(undefined)
    expect(result.$lastFocusedEl).toBe(null)

    global.document.activeElement = 'mock-element'
    result = new TimeoutWarning(mockModule)
    expect(result.saveLastFocusedEl()).toBe(undefined)
    expect(result.$lastFocusedEl).toBe(null)
  })

  it('test TimeoutWarning.makePageContentInert()', () => {
    jest.spyOn(document, 'querySelector').mockImplementation((param) => null)
    expect(new TimeoutWarning(mockModule).makePageContentInert()).toBe(undefined)

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      setAttribute: (paramA, paramB) => {}
    }))
    expect(new TimeoutWarning(mockModule).makePageContentInert()).toBe(undefined)
  })

  it('test TimeoutWarning.removeInertFromPageContent()', () => {
    jest.spyOn(document, 'querySelector').mockImplementation((param) => null)
    expect(new TimeoutWarning(mockModule).removeInertFromPageContent()).toBe(undefined)

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      setAttribute: (paramA, paramB) => {}
    }))
    expect(new TimeoutWarning(mockModule).removeInertFromPageContent()).toBe(undefined)
  })

  it('test TimeoutWarning.isDialogOpen()', () => {
    expect(new TimeoutWarning(mockModule).isDialogOpen()).toBe(undefined)
  })

  it('test TimeoutWarning.closeDialog()', () => {
    mockModule = origMockModule
    expect(new TimeoutWarning(mockModule).closeDialog()).toBe(undefined)

    mockModule = {
      ...mockModule,
      open: 'mock-module-open',
      close: jest.fn(() => {})
    }

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      setAttribute: (paramA, paramB) => {},
      classList: {
        remove: (addParam) => null
      }
    }))
    expect(new TimeoutWarning(mockModule).closeDialog()).toBe(undefined)
  })

  it('test TimeoutWarning.clearTimers', () => {
    expect(new TimeoutWarning(mockModule).clearTimers()).toBe(undefined)
  })

  it('test TimeoutWarning.disableBackButtonWhenOpen()', () => {
    mockModule = origMockModule
    expect(new TimeoutWarning(mockModule).disableBackButtonWhenOpen()).toBe(undefined)

    mockModule = {
      ...mockModule,
      open: 'mock-module-open'
    }
    expect(new TimeoutWarning(mockModule).disableBackButtonWhenOpen()).toBe(undefined)
  })

  xit('test TimeoutWarning.escClose()', () => {
    const param = {}
    mockModule = origMockModule
    expect(new TimeoutWarning(mockModule).escClose(param)).toBe(undefined)

    mockModule = {
      ...mockModule,
      open: 'mock-module-open',
      close: jest.fn(() => {})
    }
    param.keyCode = 27
    expect(new TimeoutWarning(mockModule).escClose(param)).toBe(undefined)
  })

  it('test TimeoutWarning.setLastActiveTimeOnServer()', () => {
    const result = new TimeoutWarning(mockModule)
    expect(result).toBeDefined()
    expect(result.setLastActiveTimeOnServer()).toBe(0)
  })
})
  