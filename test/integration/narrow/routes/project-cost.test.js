const { crumbToken } = require('./test-helper')

const varListTemplate = {
  farmingType: 'some fake crop',
  legalStatus: 'fale status',
  inEngland: 'Yes',
  projectStarted: 'No',
  landOwnership: 'Yes',
  projectItemsList: {
    projectEquipment: ['Boom', 'Trickle']
  },
  projectCost: '12345678',
  'current-score': ''
}

let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return 'Error'
  }
}

jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Project cost page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page successfully if no projectCost', async () => {

    varList = {
      farmingType: 'some fake crop',
      legalStatus: 'fale status',
      inEngland: 'Yes',
      projectStarted: 'No',
      landOwnership: 'Yes',
      projectItemsList: {
        projectEquipment: ['Boom', 'Trickle']
      },
      projectCost: undefined,
      'current-score': ''
    }

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should redirect to project summary page if theres score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/project-summary`)
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the estimated cost for the items')
  })

  it('should return an error message if no option is selected and no projectItemsList', async () => {
    varList = {
      farmingType: 'some fake crop',
      legalStatus: 'fale status',
      inEngland: 'Yes',
      projectStarted: 'No',
      landOwnership: 'Yes',
      projectItemsList: undefined,
      projectCost: '1111',
      'current-score': ''
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
  })

  it('should return an error message if a string is typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234s6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if number contains a space', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234 6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if number contains a comma "," ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '123,456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if a fraction is typed in - it contains a dot "." ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '123.456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if the number of digits typed exceed 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '12345678', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should eliminate user if the cost entered is too low', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '12', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('should eliminate user if the cost entered is too high', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '9999999', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('should store valid user input and redirect to project grant page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234567', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/potential-amount`)
  })
})
