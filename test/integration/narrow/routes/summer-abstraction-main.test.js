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
remainingCost: 14082.00,
payRemainingCosts: 'Yes',
planningPermission: 'Will not be in place by 31 January 2023',
abstractionLicence: 'Not needed',
sSSI: 'Yes',
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

describe('summer abstractionmains page', () => {
beforeEach(() => {
    varList = { ...varListTemplate }
})

afterEach(() => {
    jest.resetAllMocks()
})

it('should load page successfully', async () => {
    const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/summer-abstraction-mains`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will you use water from summer abstraction or mains?')
})


it('should return an error message if no option is selected', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
    payload: { crumb: crumbToken },
    headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you’re going to use summer abstraction or mains')
})

it('should store valid user input and redirect to irrgation-water-source page', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
    payload: { summerAbstractionMains: 'No', crumb: crumbToken },
    headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('water-source')
})

it('should display ineligible page when user response is \'Yes\'', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
    payload: { summerAbstractionMains: 'Yes', crumb: crumbToken },
    headers: {
        cookie: 'crumb=' + crumbToken
    }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Your project cannot increase water use from summer abstraction or mains.')
})
})
