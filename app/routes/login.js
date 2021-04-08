const Joi = require('joi')

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
          username: Joi.string().required(),
          password: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          return h.view('login', createModel()).takeover()
        }
      },
      handler: (request, h) => {
        console.log(request.payload)
        return h.redirect('./start')
      }
    }
  }
]
