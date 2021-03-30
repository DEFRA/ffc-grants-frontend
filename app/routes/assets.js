module.exports = {
  method: 'GET',
  path: '/slurry/assets/{path*}',
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
