describe('Remaining costs page', () => {
	let server
	const createServer = require('../../../../app/server')

	beforeEach(async () => {
		server = await createServer()
		await server.start()
	})

	it('should load page successfully', async () => {
		const options = {
			method: 'GET',
			url: '/remaining-costs'
		}

		const response = await server.inject(options)
		expect(response.statusCode).toBe(200)
	})

	it('should return an error message if no option is selected', async () => {
		const postOptions = {
			method: 'POST',
			url: '/remaining-costs',
			payload: {}
		}

		const postResponse = await server.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs without using any other grant money')
	})

	it('should show elimination message if the user select NO', async () => {
		const postOptions = {
			method: 'POST',
			url: '/remaining-costs',
			payload: { remainingCosts: 'No' }
		}

		const postResponse = await server.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
	})

	it('should store valid user input and redirect to project grant page', async () => {
		const postOptions = {
			method: 'POST',
			url: '/remaining-costs',
			payload: { remainingCosts: 'Yes' }
		}

		const postResponse = await server.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('./project-details')
	})

	afterEach(async () => {
		await server.stop()
	})
})
