const { getOptions, setOptionsLabel } = require('../../../../app/helpers/answer-options')

describe('answer-options', () => {
  test('check getOptions()', () => {

    let question = {
      costDataType: 'cost-data-type',
      answers: [],
      yarKey: 'mock-yarKey',
      type: 'input',
      classes: 'mock-classes',
      hint: 'mock-hint',
      id: 'mock-id',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: 'mock-value'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint: 'mock-hint',
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: ''
    })

    question = {
      ...question,
      type: 'email'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint: 'mock-hint',
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: ''
    })

    question = {
      ...question,
      type: 'tel'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint: 'mock-hint',
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: ''
    })

    question = {
      ...question,
      type: 'multi-input',
      allFields: [
        {
          yarKey: 'mock-yarkey',
          type: 'switch-default',
          answers: [{ value: 'value', hint: 'hint', text: 'text', conditional: 'conditional' }]
        }
      ]
    }
    const data = { 'mock-yarkey': 'mock-value' }
    expect(getOptions(data, question, 'cond-html', {})).toEqual([
      {
        classes: 'govuk-fieldset__legend--l',
        endFieldset: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        id: 'mock-yarkey',
        items: [
          { checked: false, conditional: 'conditional', hint: 'hint', selected: false, text: 'text', value: 'value' }
        ],
        name: 'mock-yarkey',
        type: 'switch-default'
      }
    ])
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual([
      {
        classes: 'govuk-fieldset__legend--l',
        endFieldset: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        id: 'mock-yarkey',
        items: [
          { checked: false, conditional: 'conditional', hint: 'hint', selected: false, text: 'text', value: 'value' }
        ],
        name: 'mock-yarkey',
        type: 'switch-default'
      }
    ])

    question = {
      ...question,
      type: 'select'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual(
      {
        "classes": "mock-classes",
        "hint": "mock-hint", 
        "id": "mock-yarKey", 
        "items": [{"text": "Select an option", "value": ""}], 
        "label": "mock-label", 
        "name": "mock-yarKey"
      }
    )

    const { classes, ...questionWithoutClasses } = question
    expect(getOptions(undefined, questionWithoutClasses, 'cond-html', {})).toEqual(
      {
        "classes": "govuk-fieldset__legend--l",
        "hint": "mock-hint", 
        "id": "mock-yarKey", 
        "items": [{"text": "Select an option", "value": ""}], 
        "label": "mock-label", 
        "name": "mock-yarKey"
      }
    )

    question = {
      ...question,
      type: 'select-default'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual(
      {
        "classes": "mock-classes", 
        "fieldset": {"legend": {"classes": "mock-classes", "isPageHeading": true, "text": undefined}}, 
        "hint": "mock-hint", 
        "id": "mock-yarKey", 
        "items": [], 
        "name": "mock-yarKey"
    }
    )
  })

  test('check setOptionsLabel()', () => {
    const answers = [
      { value: 'divider' },
      { value: 'mock-data', hint: 'mock-hint' },
      { value: 'another-mock-data', hint: 'mock-hint', conditional: 'mock-cond' },
      { value: 'another-mock-data', hint: 'mock-hint', conditional: 'mock-cond', text: 'mock-text' }
    ]
    expect(setOptionsLabel('mock-data', answers, 'cond-html')).toEqual([
      { divider: 'or' },
      {
        value: 'mock-data',
        text: 'mock-data',
        hint: 'mock-hint',
        checked: true,
        selected: true
      },
      {
        value: 'another-mock-data',
        text: 'another-mock-data',
        conditional: { html: 'cond-html' },
        hint: 'mock-hint',
        checked: false,
        selected: false
      },
      {
        value: 'another-mock-data',
        text: 'mock-text',
        conditional: 'mock-cond',
        hint: 'mock-hint',
        checked: false,
        selected: false
      }
    ])
  })
})
