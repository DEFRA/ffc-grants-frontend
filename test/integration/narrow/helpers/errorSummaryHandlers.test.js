describe('Get & Post Handlers', () => {
  jest.mock('../../../../app/helpers/session', () => {
    const original = jest.requireActual('../../../../app/helpers/session')
    return {
      ...original,
      getYarValue: jest.fn()
    }
  })
  const { getYarValue } = require('../../../../app/helpers/session')

  jest.mock('../../../../app/helpers/conditionalHTML')
  const { getHtml } = require('../../../../app/helpers/conditionalHTML')

  jest.mock('../../../../app/helpers/models')
  const { getModel } = require('../../../../app/helpers/models')

  const {
    customiseErrorText
  } = require('../../../../app/helpers/errorSummaryHandlers')

  let mockH

  test('check customiseErrorText()', () => {
    mockH = { view: jest.fn() }
    getYarValue.mockReturnValue('mock-yar-value')
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'mock-yarKey',
      type: 'multi-input',
      conditionalKey: 'mock-condKey'
    }
    let errorList = [{ href: 'mock-yarKey', text: 'mock-href-text' }]
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: ['item1', 'item2'],
        errorList: [{
          href: 'mock-yarKey',
          text: 'mock-href-text'
        }]
      })

    getModel.mockReturnValue({ items: { item1: 'item1', item2: 'item2' } })
    currentQuestion = {
      ...currentQuestion,
      type: 'mock-type'
    }
    mockH.view.mockClear()
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: {
          item1: 'item1',
          item2: 'item2',
          errorMessage: { text: 'mock-href-text' }
        },
        errorList: [{
          href: 'mock-yarKey',
          text: 'mock-href-text'
        }]
      }
    )

    getModel.mockReturnValue({ items: { item1: 'item1', item2: 'item2' } })
    errorList = [{ href: 'mock-another-yarKey', text: 'mock-another-href-text' }]
    mockH.view.mockClear()
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: { item1: 'item1', item2: 'item2' },
        errorList: [{
          href: 'mock-another-yarKey',
          text: 'mock-another-href-text'
        }]
      }
    )
  })
})
