const Joi = require('joi')
const authConfig = require('../config/auth')

function createModel () {
  return {
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
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/login',
    options: {
      auth: false
    },
    handler: (request, h) => {
      request.yar.reset()
      return h.view('login', createModel())
    }
  },
  {
    method: 'POST',
    path: '/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().valid(authConfig.credentials.username),
          password: Joi.string().valid(authConfig.credentials.password)
        }),
        failAction: (request, h, err) => {
          // FIXME: use bcrypt on password
          // FIXME: inject error message
          console.log('Authentication failed')
          return h.view('login', createModel()).takeover()
        }
      },
      handler: (request, h) => {
        request.cookieAuth.set({ authenticated: true })
        return h.redirect('./farming-type')
      }
    }
  }
]
