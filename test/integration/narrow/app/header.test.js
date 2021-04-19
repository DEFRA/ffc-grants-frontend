const hapi = require('@hapi/hapi')
const header = require('../../../../app/plugins/header')

describe('Server header test', () => {
  let server

  beforeEach(async () => {
    server = hapi.server({
      port: process.env.PORT
    })
  })

  it('create Server setup header return request with header', async () => {
    await server.register({
      plugin: header,
      options: {
        keys: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ]
      }
    })
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {
        return h.response('Header')
      }
    })
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['x-robots-tag']).toContain('noindex, nofollow')
  })

  it('create Server setup header with no option return request with NO header', async () => {
    await server.register({
      plugin: header
    })
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {
        return h.response('Header')
      }
    })

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['x-robots-tag']).toBe(undefined)
  })

  it('create Server setup No Header return request without header', async () => {
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {
        return h.response('Header')
      }
    })

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['x-robots-tag']).toBe(undefined)
  })

  afterEach(async () => {
    await server.stop()
  })
})
