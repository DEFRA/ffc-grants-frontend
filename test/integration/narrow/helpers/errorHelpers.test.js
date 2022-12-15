describe('Get & Post Handlers', () => {
  const {
    validateAnswerField,
    checkInputError
  } = require('../../../../app/helpers/errorHelpers')

  test('check validateAnswerField()', async () => {
    let value = 'value'
    let details = {}
    expect(validateAnswerField(value, 'NOT_EMPTY', details, {})).toBe(true)

    details = { max: 2 }
    expect(validateAnswerField(value, 'MAX_SELECT', details, {})).toBe(true)

    expect(validateAnswerField(value, 'DEFAULT_SELECT', details, {})).toBe(false)

    value = ['yes']
    details = {
      combinationObject: {
        questionKey: 'country',
        combinationAnswerKeys: ['country-A1']
      }
    }
    expect(validateAnswerField(value, 'COMBINATION_ANSWER', details, {})).toBe(true)

    value = ['Crops for the food industry', 'Horticulture (including ornamentals)', 'Something else']
    details = {
      combinationObject: {
        questionKey: 'farming-type',
        combinationAnswerKeys: ['farming-type-A1', 'farming-type-A2', 'farming-type-A3']
      }
    }
    expect(validateAnswerField(value, 'COMBINATION_ANSWER', details, {})).toBe(true)
  })

  test('check checkInputError()', () => {
    let validate = [{ type: 'NOT_EMPTY', dependentKey: 'dep-yarKey' }]
    expect(checkInputError(validate, false, {}, '')).toBe(undefined)

    validate = [{ type: 'DEFAULT_SELECT', dependentKey: 'dep-yarKey' }]
    expect(checkInputError(validate, true, { 'dep-yarKey': 'depYarkeyValue' }, '')).toEqual(
      { type: 'DEFAULT_SELECT', dependentKey: 'dep-yarKey' }
    )
  })
})
