describe('Planning permission page', () => {
	let server
	const createServer = require('../../../../app/server')

	beforeEach(async () => {
		server = await createServer()
		await server.start()
	})

	it('should load page successfully', async () => {
		const options = {
			method: 'GET',
			url: '/planning-permission'
		}

		const response = await server.inject(options)
		expect(response.statusCode).toBe(200)
	})

	it('should return an error message if no option is selected', async () => {
		const postOptions = {
			method: 'POST',
			url: '/planning-permission',
			payload: {}
		}

		const postResponse = await server.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Select when the project will have planning permission')
	})

	it('should store valid user input and redirect to project details page', async () => {
		const postOptions = {
			method: 'POST',
			url: '/planning-permission',
			payload: { planningPermission: 'some fake permission' }
		}

		const postResponse = await server.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('./project-details')
	})

	afterEach(async () => {
		await server.stop()
	})
})
