const Hapi = require('@hapi/hapi')
const vision = require('@hapi/vision')

describe('Error Page', () => {
  let mockServer
  const boom = require('@hapi/boom')
  const nunjucks = require('nunjucks')

  test('should return 404', async () => {
    const options = {
      method: 'GET',
      url: '/upgrading-calf-housing/somethingnotavailable'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Page not found')
  })

  test('should return 400', async () => {
    mockServer = Hapi.server({
      port: 4000
    })
    await mockServer.register(require('../../../../app/plugins/error-pages'))
    mockServer.route([{
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        throw boom.badRequest()
      }
    }])

    await mockServer.register(vision)

    mockServer.views({
      engines: {
        njk: {
          compile: (src, options) => {
            const template = nunjucks.compile(src, options.environment)
            return context => template.render(context) // .layout.njk not found, unknown path
          }
        }
      },
      relativeTo: __dirname,
      compileOptions: {
        environment: nunjucks.configure([
          'app/templates',
          'app/assets/dist',
          'node_modules/govuk-frontend/'
        ])
      },
      path: '../../../../app/templates',
      context: {
        assetpath: '../../../../app/assets',
        govukAssetpath: '../../../../app/assets',
        serviceName: 'FFC Grants Service',
        pageTitle: 'FFC Grants Service'
      }
    })

    await mockServer.start()

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await mockServer.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Bad request.')

    await mockServer.stop()
  })

  test('should return 403', async () => {
    mockServer = Hapi.server({
      port: 4000
    })
    await mockServer.register(require('../../../../app/plugins/error-pages'))
    mockServer.route([{
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        throw boom.forbidden()
      }
    }])

    await mockServer.register(vision)

    mockServer.views({
      engines: {
        njk: {
          compile: (src, options) => {
            const template = nunjucks.compile(src, options.environment)
            return context => template.render(context) // .layout.njk not found, unknown path
          }
        }
      },
      relativeTo: __dirname,
      compileOptions: {
        environment: nunjucks.configure([
          'app/templates',
          'app/assets/dist',
          'node_modules/govuk-frontend/'
        ])
      },
      path: '../../../../app/templates',
      context: {
        assetpath: '../../../../app/assets',
        govukAssetpath: '../../../../app/assets',
        serviceName: 'FFC Grants Service',
        pageTitle: 'FFC Grants Service'
      }
    })

    await mockServer.start()

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await mockServer.inject(options)
    expect(response.statusCode).toBe(403)
    expect(response.payload).toContain('Sorry, there is a problem with the service')

    await mockServer.stop()
  })

  test('should return 500', async () => {
    mockServer = Hapi.server({
      port: 4000
    })
    await mockServer.register(require('../../../../app/plugins/error-pages'))
    mockServer.route([{
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        throw boom.badImplementation()
      }
    }])

    await mockServer.register(vision)

    mockServer.views({
      engines: {
        njk: {
          compile: (src, options) => {
            const template = nunjucks.compile(src, options.environment)
            return context => template.render(context) // .layout.njk not found, unknown path
          }
        }
      },
      relativeTo: __dirname,
      compileOptions: {
        environment: nunjucks.configure([
          'app/templates',
          'app/assets/dist',
          'node_modules/govuk-frontend/'
        ])
      },
      path: '../../../../app/templates',
      context: {
        assetpath: '../../../../app/assets',
        govukAssetpath: '../../../../app/assets',
        serviceName: 'FFC Grants Service',
        pageTitle: 'FFC Grants Service'
      }
    })

    await mockServer.start()

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await mockServer.inject(options)
    expect(response.statusCode).toBe(500)
    expect(response.payload).toContain('Sorry, there is a problem with the service')

    await mockServer.stop()
  })
})
