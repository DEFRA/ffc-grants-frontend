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

    value = ['Pig', 'Beef', 'Dairy']
    details = {
      combinationObject: {
        questionKey: 'applicant-type',
        combinationAnswerKeys: ['applicant-type-A1', 'applicant-type-A2', 'applicant-type-A3']
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
