module.exports = {
  method: 'GET',
  path: '/water/assets/{path*}',
  options: {
    handler: {
      directory: {
        path: ['app/assets/dist']
      }
    },
    cache: {
      privacy: 'private'
    }
  }
}
