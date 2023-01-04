describe('Data formats', () => {
  const { formatUKCurrency } = require('../../../../app/helpers/data-formats')

  test('check formatUKCurrency() - string', () => {
    expect(formatUKCurrency('string')).toEqual('NaN')
  })

  test('check formatUKCurrency() - 1 digit number', () => {
    expect(formatUKCurrency(4)).toEqual('4')
  })

  test('check formatUKCurrency() - 5 digit number', () => {
    expect(formatUKCurrency(40000.00)).toEqual('40,000')
  })
})
