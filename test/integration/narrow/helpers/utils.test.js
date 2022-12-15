jest.mock('../../../../app/helpers/session')
const { getYarValue } = require('../../../../app/helpers/session')

describe('Utils', () => {
  test('notUniqueSelection', () => {
    const { notUniqueSelection } = require('../../../../app/helpers/utils')

    const option = 'option'
    let answers = 'answers'
    expect(notUniqueSelection(answers, option)).toBeFalsy

    answers = 'stringIncludesoption'
    expect(notUniqueSelection(answers, option)).toBeFalsy

    answers = ['option']
    expect(notUniqueSelection(answers, option)).toBeFalsy

    answers = ['notOption', 'option']
    expect(notUniqueSelection(answers, option)).toBe(true)
  })

  test('uniqueSelection', () => {
    const { uniqueSelection } = require('../../../../app/helpers/utils')

    const option = 'option'
    let answers = 'answers'
    expect(uniqueSelection(answers, option)).toBeFalsy

    answers = 'stringIncludesoption'
    expect(uniqueSelection(answers, option)).toBe(true)

    answers = ['notOption', 'option']
    expect(uniqueSelection(answers, option)).toBe(false)

    answers = ['option']
    expect(uniqueSelection(answers, option)).toBeFalsy
  })

  test('getQuestionByKey', () => {
    const { ALL_QUESTIONS } = require('../../../../app/config/question-bank-redux.js')
    const { getQuestionByKey } = require('../../../../app/helpers/utils')

    const containsKey = (searchKey) => (ALL_QUESTIONS.some(({ key }) => searchKey === key))

    expect(containsKey('fake-key')).toBe(false)
    expect(getQuestionByKey('fake-key')).toBeUndefined

    expect(containsKey('farming-type')).toBe(true)
    expect(getQuestionByKey('farming-type')).toBeDefined
    expect(getQuestionByKey('farming-type')).toEqual(
      expect.objectContaining({
        key: 'farming-type',
        baseUrl: 'farming-type'
      })
    )
  })

  test('getQuestionAnswer', () => {
    const { getQuestionAnswer } = require('../../../../app/helpers/utils')
    expect(getQuestionAnswer('farming-type', 'farming-type-A1')).toBe('Crops for the food industry')
  })

  test('allAnswersSelected', () => {
    const { allAnswersSelected } = require('../../../../app/helpers/utils')

    const mockAnswerList = ['farming-type-A1', 'farming-type-A2', 'farming-type-A3']

    getYarValue.mockReturnValueOnce(['Crops for the food industry', 'Horticulture (including ornamentals)'])
    getYarValue.mockReturnValueOnce(['Crops for the food industry', 'Horticulture (including ornamentals)', 'Something else'])

    expect(allAnswersSelected([], 'farming-type', mockAnswerList)).toBe(false)
    expect(allAnswersSelected([], 'farming-type', mockAnswerList)).toBe(true)
  })

  test('someAnswersSelected', () => {
    const { someAnswersSelected } = require('../../../../app/helpers/utils')

    const mockAnswerList = ['farming-type-A1', 'farming-type-A2', 'farming-type-A3']

    getYarValue.mockReturnValueOnce([])
    getYarValue.mockReturnValueOnce(['Crops for the food industry', 'Horticulture (including ornamentals)', 'Something else'])

    expect(someAnswersSelected([], 'farming-type', mockAnswerList)).toBe(false)
    expect(someAnswersSelected([], 'farming-type', mockAnswerList)).toBe(true)
  })
})
