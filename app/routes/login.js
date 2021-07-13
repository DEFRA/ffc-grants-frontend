const Joi = require('joi')
const authConfig = require('../config/auth')
const bcrypt = require('bcrypt')

const { urlPrefix, startPageUrl } = require('../config/server')
const viewTemplate = 'login'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = startPageUrl

const errorText = 'Enter the username and password you\'ve been given'

function createModel (errorMessage) {
  return {
    formActionPage: currentPath,
    usernameInput: {
      label: {
        text: 'Username'
      },
      classes: 'govuk-input--width-10',
      id: 'username',
      name: 'username'
    },
    passwordInput: {
      label: {
        text: 'Password'
      },
      classes: 'govuk-input--width-10',
      id: 'password',
      name: 'password',
      type: 'password'
    },
    errorMessage
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    options: {
      auth: false
    },
    handler: (request, h) => {
      request.yar.reset()
      return h.view(viewTemplate, createModel(null))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().valid(authConfig.credentials.username),
          password: Joi.string().custom((value, helpers) => {
            if (bcrypt.compareSync(value, authConfig.credentials.passwordHash)) {
              return value
            }

            throw new Error('Incorrect password')
          })
        }),
        failAction: (request, h, err) => {
          console.log('Authentication failed')
          return h.view(viewTemplate, createModel(errorText)).takeover()
        }
      },
      handler: (request, h) => {
        request.cookieAuth.set({ authenticated: true })
        return h.redirect(nextPath)
      }
    }
  }
]
