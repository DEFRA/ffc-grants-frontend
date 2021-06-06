const { crumbToken } = require('./test-helper')

describe('Planning permission page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status',
    inEngland: 'Yes',
    projectStarted: 'No',
    landOwnership: 'Yes',
    projectItemsList: {
      projectEquipment: ['Boom', 'Trickle']
    },
    projectCost: '12345678',
    remainingCost: 14082.00,
    payRemainingCosts: 'Yes',
    planningPermission: 'Will not have by 31 December 2021'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have planning permission')
  })

  it('if value = \'Will not have by 31 December 2021\' ==> disqualify user', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      payload: { planningPermission: 'Will not have by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('if value = \'Expected to have by 31 December 2021\' ==> store and redirect to planning-required-condition page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      payload: { planningPermission: 'Expected to have by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/planning-required-condition`)
  })

  it('if value = \'Not needed\' ==> store and redirect to project start page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      payload: { planningPermission: 'Not needed', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/project-start`)
  })

  it('if value = \'Secured\' ==> store and redirect to project start page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      payload: { planningPermission: 'Secured', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/project-start`)
  })
})
