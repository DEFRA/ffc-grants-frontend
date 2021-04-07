
module.exports = {
  plugin: {
    name: 'header',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response
        if (response.isBoom) {
          options?.keys?.forEach(x => {
            response.output.headers[x.key] = x.value
          })
        } else {
          options?.keys?.forEach(x => {
            response.header(x.key, x.value)
          })
        }
        return h.continue
      })
    }
  }
}
