module.exports = {
  credentials: {
    username: process.env.AUTH_USERNAME,
    password: process.env.AUTH_PASSWORD
  },
  cookie: {
    name: 'session-auth',
    password: process.env.COOKIE_PASSWORD,
    isSecure: process.env.NODE_ENV === 'production'
  },
  enabled: process.env.LOGIN_REQUIRED === 'true'
}
