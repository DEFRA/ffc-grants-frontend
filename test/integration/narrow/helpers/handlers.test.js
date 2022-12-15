describe('Get & Post Handlers', () => {
  const varList = {
    planningPermission: 'some fake value',
    gridReference: 'grid-ref-num',
    businessDetails: 'fake business',
    applying: true
  }

  jest.mock('../../../../app/helpers/page-guard', () => ({
    guardPage: (a, b, c) => false
  }))

  jest.mock('../../../../app/helpers/urls', () => ({
    getUrl: (a, b, c, d) => 'mock-url'
  }))

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  let question
  let mockH

  const { getHandler } = require('../../../../app/helpers/handlers')

  test('is eligible if calculated grant = min grant - whether grant is capped or not', async () => {
    question = {
      url: 'mock-url',
      title: 'mock-title',
      maybeEligible: true,
      maybeEligibleContent: { reference: 'mock-reference' }
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/water/start')
  })
})
