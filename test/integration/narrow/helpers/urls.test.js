describe('urls.js', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getUrl } = require('../../../../app/helpers/urls')

  test('getUrl()', () => {
    let dict = {}
    getYarValue.mockImplementation((req, key) => (dict[key]))

    let urlObject = null
    let secBtn = 'Back to score'
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('/water/score')

    secBtn = ''
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('mock-url')

    urlObject = {
      dependentQuestionYarKey: 'dependentQuestionYarKey',
      dependentAnswerKeysArray: 'dependentAnswerKeysArray',
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl',
        nonDependentUrl: 'nonDependentUrl'
      }
    }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('nonDependentUrl')

    dict = { dependentQuestionYarKey: 'dp-yarKey' }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('elseUrl')
  })
})
