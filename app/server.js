const hapi = require('@hapi/hapi')
const nunjucks = require('nunjucks')
const vision = require('@hapi/vision')
const path = require('path')
const inert = require('@hapi/inert')
const config = require('./config')
const crumb = require('@hapi/crumb')
const { version } = require('../package.json')

async function createServer () {
  const server = hapi.server({
    port: process.env.PORT
  })

  await server.register(require('./plugins/auth'))

  await server.register(inert)
  await server.register(vision)
  await server.register(require('./plugins/cookies'))
  await server.register(require('./plugins/error-pages'))
  await server.register({
    plugin: require('./plugins/header'),
    options: {
      keys: [
        { key: 'X-Frame-Options', value: 'deny' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // { key: 'Content-Security-Policy', value: 'default-src \'self\'' },
        // { key: 'Feature-Policy', value: 'none' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
      ]
    }
  })
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
    path: './templates',
    context: {
      appVersion: version,
      assetPath: '/static',
      govukAssetPath: '/assets',
      serviceName: 'FFC Grants Service',
      pageTitle: 'FFC Grants Service - GOV.UK',
      googleTagManagerKey: config.googleTagManagerKey
    }
  })

  return server
}

module.exports = createServer
