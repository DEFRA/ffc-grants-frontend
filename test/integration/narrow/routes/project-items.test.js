const { crumbToken } = require('./test-helper')

describe('Irrigation water source page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status',
    inEngland: 'Yes',
    projectStarted: 'No',
    landOwnership: 'Yes',
    projectItemsList: {
      projectEquipment: ['Boom', 'Trickle']
    }
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
      url: '/project-items'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select all the items your project needs')
  })

  it('should store user response from column: "projectInfrastucture" and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectInfrastucture: 'Synthetic liner', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  it('should store user response from column: "projectEquipment" and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectEquipment: ['Boom', 'Trickle'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  it('should store user response from column: "projectTechnology" and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectTechnology: 'Software to monitor soil moisture levels and schedule irrigation', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  it('should store user response from all columns and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: {
        projectInfrastucture: 'Overflow/spillway',
        projectEquipment: ['Ebb and flood or capillary bed', 'Sprinklers and mist'],
        projectTechnology: 'Software and sensors to optimise water application',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })
})
