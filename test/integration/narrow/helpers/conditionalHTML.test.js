describe('Conditional html', () => {
  const { getHtml } = require('../../../../app/helpers/conditionalHTML')

  test('check function getHtml - robotic equipment, no errors', () => {
    const label = 'roboticEquipment'
    const labelData = 'MOCK_LABEL_DATA'
    const fieldValueData = 'MOCK_FIELD_VALUE_DATA'
    const error = false

    const result = getHtml(label, labelData, fieldValueData, error)
    expect(result).not.toContain('<div class="govuk-form-group govuk-form-group--error">')
  })

  test('check function getHtml - robotic equipment, no errors, empty fieldValueData', () => {
    const label = 'roboticEquipment'
    const labelData = 'MOCK_LABEL_DATA'
    const fieldValueData = ''
    const error = false

    const result = getHtml(label, labelData, fieldValueData, error)
    expect(result).not.toContain('<div class="govuk-form-group govuk-form-group--error">')
  })

  test('check function getHtml - robotic equipment, with errors', () => {
    const label = 'roboticEquipment'
    const labelData = 'MOCK_LABEL_DATA'
    const fieldValueData = 'MOCK_FIELD_VALUE_DATA'
    const error = true

    const result = getHtml(label, labelData, fieldValueData, error)
    expect(result).toContain('<div class="govuk-form-group govuk-form-group--error">')
    expect(result).toContain('Error:')
    expect(result).toContain('You can enter up to 60 words')
  })

  test('check function getHtml - not robotic equipment, no errors', () => {
    const label = 'not_roboticEquipment'
    const labelData = 'MOCK_LABEL_DATA'
    const fieldValueData = 'MOCK_FIELD_VALUE_DATA'
    const error = false

    const result = getHtml(label, labelData, fieldValueData, error)
    expect(result).not.toContain('<div class="govuk-form-group--error">')
  })

  test('check function getHtml - not robotic equipment, with errors', () => {
    const label = 'not_roboticEquipment'
    const labelData = 'MOCK_LABEL_DATA'
    const fieldValueData = 'MOCK_FIELD_VALUE_DATA'
    const error = true

    const result = getHtml(label, labelData, fieldValueData, error)
    expect(result).toContain('<div class="govuk-form-group--error">')
    expect(result).toContain('<span id="post-code-error" class="govuk-error-message">')
    expect(result).toContain('Error:')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third govuk-input--error"')
  })
})
