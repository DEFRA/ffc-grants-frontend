module.exports = {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    handler: {
      directory: {
        path: ['app/assets/dist']
      }
    },
    cache: {
      privacy: 'private'
    },
    auth: false
  }
}
