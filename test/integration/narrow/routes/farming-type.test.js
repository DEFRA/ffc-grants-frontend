describe('Farming type page', () => {
    let server
    const createServer = require('../../../../app/server')

    beforeEach(async () => {
        server = await createServer()
        await server.start()
    })

    it('should load page successfully', async () => {
        const options = {
            method: 'GET',
            url: '/farming-type'
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(200)
    })

    it('should have an id on all inputs', async () => {
        const options = {
            method: 'GET',
            url: '/farming-type'
        }

        const response = await server.inject(options)
        expect(response.payload).toContain(`<input class=\"govuk-radios__input\" id=\"farmingType\"`)
        expect(response.payload).toContain(`<input class=\"govuk-radios__input\" id=\"farmingType-2\"`)
        expect(response.payload).toContain(`<input class=\"govuk-radios__input\" id=\"farmingType-3\"`)
    });

    it('should have a for attribute on all input labels', async () => {
        const options = {
            method: 'GET',
            url: '/farming-type'
        }
        const response = await server.inject(options)
        expect(response.payload).toContain(`<label class=\"govuk-label govuk-radios__label\" for=\"farmingType\">`)
        expect(response.payload).toContain(`<label class=\"govuk-label govuk-radios__label\" for=\"farmingType\">`)
        expect(response.payload).toContain(`<label class=\"govuk-label govuk-radios__label\" for=\"farmingType\">`)
    });

    it('should returns error message if no option is selected', async () => {
        const postOptions = {
            method: 'POST',
            url: '/farming-type',
            payload: { farmingType: null }
        }

        const postResponse = await server.inject(postOptions)
        expect(postResponse.statusCode).toBe(200)
        expect(postResponse.payload).toContain('Please select an option')
    })

    it('should store user response and redirects to legal status page', async () => {
        const postOptions = {
            method: 'POST',
            url: '/farming-type',
            payload: { farmingType: 'Horticulture' }
        }

        const postResponse = await server.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('./legal-status')
    })

    it(`should redirect to ineligible page when farming type is 'Something else'`, async () => {
        const postOptions = {
            method: 'POST',
            url: '/farming-type',
            payload: { farmingType: 'Something else' }
        }

        const postResponse = await server.inject(postOptions)
        expect(postResponse.payload).toContain(
            'You cannot apply for a grant from this scheme'
        )
    })

    afterEach(async () => {
        await server.stop()
    })
})
