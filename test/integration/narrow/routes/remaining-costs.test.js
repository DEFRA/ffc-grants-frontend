const { crumbToken } = require('./test-helper')

describe('Remaining costs page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
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
      payRemainingCosts: 'Yes'
    }
    jest.mock('../../../../app/helpers/session', () => ({
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (Object.keys(varList).includes(key)) return varList[key]
        else return 'Error'
      }
    }))
  })
  it('should load page successfully', async () => {
    const postOptions = {
      method: 'GET',
      url: '/remaining-costs',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.headers.location).toBe('./project-cost')

    // expect(postResponse.statusCode).toBe(200)
  })

  it('redirects to /project-cost if projectCost value has not been saved', async () => {
    const varList2 = {
      farmingType: 'some fake crop',
      legalStatus: 'fale status',
      inEngland: 'Yes',
      projectStarted: 'No',
      landOwnership: 'Yes',
      projectItemsList: {
        projectEquipment: ['Boom', 'Trickle']
      },
      projectCost: '12345678',
      remainingCost: null,
      payRemainingCosts: 'Yes'
    }

    jest.mock('../../../../app/helpers/session', () => ({
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (Object.keys(varList2).includes(key)) return varList2[key]
        else return 'Error'
      }
    }))

    const options = {
      method: 'GET',
      url: '/remaining-costs',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./project-cost')
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs without using any other grant money')
  })

  it('user selects NO -> show elimination message', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { payRemainingCosts: 'No', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.headers.location).toBe('./project-cost')

    // expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects YES -> store valid user input and redirect to planning-permission', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { payRemainingCosts: 'Yes', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./planning-permission')
  })
})
