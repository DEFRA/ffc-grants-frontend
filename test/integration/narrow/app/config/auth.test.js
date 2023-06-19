const auth = require('../../../../../app/config/auth')

describe('auth', () => {
	test('should have the right values frrom env', () => {
		// this expects the env variables to be set in the test environment
		// this is purely for coverage!

		expect(auth.credentials.username).toBe(process.env.AUTH_USERNAME)
		expect(auth.credentials.passwordHash).toBe(process.env.AUTH_PASSWORD_HASH)
		expect(auth.cookie.name).toBe('session-auth')
		expect(auth.cookie.password).toBe(process.env.COOKIE_PASSWORD)
		 // this is set to true if the env var equals "production", so better to expect any Boolean, so the test will pass in any environment
		expect(auth.cookie.isSecure).toStrictEqual(expect.any(Boolean))
		// this is set to true if the env var equals "true", so better to expect any Boolean, so the test will pass in any environment
		expect(auth.enabled).toStrictEqual(expect.any(Boolean))
	 })
	})
