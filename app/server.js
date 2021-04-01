const hapi = require('@hapi/hapi')
const nunjucks = require('nunjucks')
const vision = require('@hapi/vision')
const path = require('path')
const inert = require('@hapi/inert')
const config = require('./config')
const crumb = require('@hapi/crumb')

async function createServer () {
  const server = hapi.server({
    port: process.env.PORT
  })

  await server.register(inert)
  await server.register(vision)
  await server.register(require('./plugins/cookies'))
  await server.register(require('./plugins/error-pages'))
  // Session cache with yar
  await server.register([
    {
      plugin: require('@hapi/yar'),
      options: {
        storeBlank: true,
        cookieOptions: {
          password: config.cookiePassword,
          isSecure: config.cookieOptions.isSecure
        }
      }
    },
    {
      plugin: crumb,
      options: {
        cookieOptions: {
          isSecure: config.cookieOptions.isSecure
        }
      }
    }]
  )

  server.route(require('./routes'))

  server.views({
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return context => template.render(context)
        }
      }
    },
    relativeTo: __dirname,
    compileOptions: {
      environment: nunjucks.configure([
        path.join(__dirname, 'templates'),
        path.join(__dirname, 'assets', 'dist'),
        'node_modules/govuk-frontend/'
      ])
    },
    path: './templates'
  })

  return server
}

module.exports = createServer
