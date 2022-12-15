jest.mock('../../../../app/helpers/utils', () => {
  const original = jest.requireActual('../../../../app/helpers/utils')
  return {
    ...original,
    allAnswersSelected: jest.fn(),
    getQuestionByKey: jest.fn().mockReturnValue({
      yarKey: 'testYarKey',
      answers: [
        {
          key: 'testKey',
          value: 'testValue'
        }
      ]
    })
  }
})
const { allAnswersSelected } = require('../../../../app/helpers/utils')

jest.mock('../../../../app/helpers/urls')
const { getUrl } = require('../../../../app/helpers/urls')

jest.mock('../../../../app/helpers/session')
const { getYarValue } = require('../../../../app/helpers/session')

describe('Models', () => {
  const question = {
    type: 'mock_type',
    backUrl: 'mock_back_url',
    key: 'mock_key',
    answers: [{
      value: 'mock_answer_value',
      hint: 'hint',
      text: 'answer_text'
    }],
    backUrlObject: {
      dependentQuestionYarKey: 'tenancyLength',
      dependentAnswerKeysArray: ['tenancy-length-A1'],
      urlOptions: {
        thenUrl: 'tenancy-length',
        elseUrl: 'tenancy-length-condition',
        nonDependentUrl: 'tenancy'
      }
    },
    sidebar: {
      values: [
        {
          heading: 'Eligibility',
          content: [
            {
              para: 'This grant is for:',
              items: [
                'arable and horticultural farming businesses supplying the food industry',
                'nurseries growing ornamentals',
                'forestry nurseries'
              ]
            }
          ]
        }
      ]
    }
  }

  const { getModel } = require('../../../../app/helpers/models')

  test('inspect getModel() - full value', () => {
    expect(getModel([], question, {})).toEqual({
      type: 'mock_type',
      key: 'mock_key',
      title: undefined,
      backUrl: undefined,
      hint: undefined,
      items: {
        classes: 'govuk-fieldset__legend--l',
        id: undefined,
        name: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        items: [
          {
            checked: false,
            conditional: undefined,
            hint: 'hint',
            selected: false,
            text: 'answer_text',
            value: 'mock_answer_value'
          }
        ]
      },
      sideBarText: {
        values: [
          expect.objectContaining({ heading: 'Eligibility' })
        ]
      },
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      },
      reachedCheckDetails: false,
      reachedEvidenceSummary: false,
      diaplaySecondryBtn: false
    })
  })

  test('inspect getModel().title', () => {
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: undefined
      })
    )

    question.label = { text: 'mock_label_text' }
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: 'mock_label_text'
      })
    )

    question.title = 'mock_title'
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: 'mock_title'
      })
    )
  })

  test('inspect getModel().backUrl', () => {
    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce(undefined)

    getUrl.mockReturnValueOnce('remaining-costs')
    getUrl.mockReturnValueOnce('tenancy')
    getUrl.mockReturnValueOnce('tenancy')

    expect(getModel([], question, {}).backUrl).toBeNull()
    expect(getModel([], question, {}).backUrl).toEqual('tenancy')
    expect(getModel([], question, {}).backUrl).toEqual('tenancy')
  })

  test('inspect getModel().warningDetails', () => {
    question.warningCondition = {
      dependentWarningQuestionKey: 'mock_key',
      dependentWarningAnswerKeysArray: {},
      warning: {
        text: 'mock_warning_text',
        iconFallbackText: 'mock_warning'
      }
    }

    allAnswersSelected.mockReturnValueOnce(true)

    expect(getModel([], question, {}).warning).toEqual({
      text: 'mock_warning_text',
      iconFallbackText: 'mock_warning'
    })
  })

  test('Test sidebar in getModel when no yar key value', () => {
    const questionForSidebar = {
      type: 'mock_type',
      backUrl: 'mock_back_url',
      key: 'mock_key',
      answers: [{
        value: 'mock_answer_value',
        hint: 'hint',
        text: 'answer_text'
      }],
      backUrlObject: {
        dependentQuestionYarKey: 'tenancyLength',
        dependentAnswerKeysArray: ['tenancy-length-A1'],
        urlOptions: {
          thenUrl: 'tenancy-length',
          elseUrl: 'tenancy-length-condition',
          nonDependentUrl: 'tenancy'
        }
      },
      sidebar: {
        mainHeading: 'Your project items',
        values: [
          {
            heading: 'Store',
            content: [{
              para: '',
              items: [],
              dependentAnswerExceptThese: []
            }]
          },
          {
            heading: 'Cover',
            content: [{
              para: '',
              items: [],
              dependentAnswerExceptThese: []
            }]
          }],
        prefixSufix: [{
          linkedPrefix: 'Increase: ',
          linkedSufix: 'm³'
        }],
        linkedQuestionkey: ['serviceable-capacity-increase-additional'],
        dependentQuestionKeys: ['storage-type', 'cover-type']
      },
      score: '123',
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      }
    }

    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce(undefined)

    expect(getModel([], questionForSidebar, {})).toEqual({
      type: 'mock_type',
      key: 'mock_key',
      title: undefined,
      backUrl: undefined,
      hint: undefined,
      items: {
        classes: 'govuk-fieldset__legend--l',
        id: undefined,
        name: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        items: [
          {
            checked: false,
            conditional: undefined,
            hint: 'hint',
            selected: false,
            text: 'answer_text',
            value: 'mock_answer_value'
          }
        ]
      },
      sideBarText: {
        dependentQuestionKeys: [
          'storage-type', 'cover-type'
        ],
        linkedQuestionkey: ['serviceable-capacity-increase-additional'],
        mainHeading: 'Your project items',
        prefixSufix: [
          {
            linkedPrefix: 'Increase: ',
            linkedSufix: 'm³'
          }
        ],
        values: [
          {
            content: [{
              dependentAnswerExceptThese: [],
              items: [
                'mock-value'
              ],
              para: ''
            }],
            heading: 'Store'
          },
          {
            content: [
              {
                dependentAnswerExceptThese: [],
                items: [
                  'Not needed'
                ],
                para: ''
              }

            ],
            heading: 'Cover'
          }
        ]
      },
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      },
      reachedCheckDetails: false,
      reachedEvidenceSummary: false,
      diaplaySecondryBtn: undefined
    })
  })

})
