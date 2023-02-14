const { crumbToken } = require('./test-helper')
const varListTemplate = {
    'current-score': null,
    waterSourcePlanned: ['Summer water surface abstraction', 'Mains']
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

describe('Decrease summer abstraction Page', () => {
    beforeEach(() => {
        varList = { ...varListTemplate }
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should load page successfully with both choices on page', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('How will your use of summer abstraction and mains change?')
    })

    it('should load page successfully if both values already exist', async () => {
        varList.summerAbstractChange = 'hello'
        varList.mainsChange = 'hello'
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('How will your use of summer abstraction and mains change?')
    })

    // update next two tests when page switching sorted
    it('should load page successfully with only summerAbstractChangeion', async () => {
        varList.watersourcePlanned = ['Summer water surface abstraction']
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('How will your use of summer abstraction change?')
    })

    it('should load page successfully with only mainsChange', async () => {
        varList.watersourcePlanned = ['Mains']

        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('How will your use of mains change?')
    })


    it('should return an error message if no option is selected', async () => {
        varList.waterSourcePlanned = ['Summer water surface abstraction', 'Mains']
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`,
            payload: { crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(200)
        expect(postResponse.payload).toContain('Select how your use of summer abstraction will change')
        expect(postResponse.payload).toContain('Select how your use of mains will change')
    })

    it('should return an error message if decrease Mains selected and summerAbstractChange not selected', async () => {
        varList.waterSourcePlanned = ['Summer water surface abstraction', 'Mains']

        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`,
            payload: { mainsChange: 'Yes', crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(200)
        expect(postResponse.payload).toContain('Select how your use of summer abstraction will change')
    })

    it('should return an error message if summerAbstractChange selected and mainsChange not selected', async () => {
        varList.waterSourcePlanned = ['Summer water surface abstraction', 'Mains']

        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`,
            payload: { summerAbstractChange: 'Yes', crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(200)
        expect(postResponse.payload).toContain('Select how your use of mains will change')
    })
    it('should store user input and redirect to irrigation system page', async () => {
        varList.waterSourcePlanned = ['Summer water surface abstraction', 'Mains']

        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`,
            payload: { summerAbstractChange: 'Yes', mainsChange: 'Yes', crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('/water/irrigation-system')
    })

    it('should redirect to start if previous question not answered', async () => {
        varList.waterSourcePlanned = null

        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`,
            headers: {
                cookie: 'crumb=' + crumbToken
            }
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(`${global.__URLPREFIX__}/start`)
    })

    it('should store user response and redirects to score', async () => {
        varList.waterSourcePlanned = ['Summer water surface abstraction', 'Mains']

        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/change-summer-abstraction`,
            payload: { summerAbstractChange: 'some fake data', mainsChange: 'more fake data', results: 'Back to score', crumb: crumbToken },
            headers: {
                cookie: 'crumb=' + crumbToken
            }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/score`)
    })

})