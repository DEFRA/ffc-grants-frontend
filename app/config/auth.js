module.exports = {
  credentials: {
    username: 'grants',
    password: 'grants'
  },
  cookie: {
    name: 'session-auth',
    password: process.env.COOKIE_PASSWORD,
    isSecure: process.env.NODE_ENV === 'production'
  },
  enabled: true
}
