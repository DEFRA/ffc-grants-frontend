module.exports = [
  {
    method: 'GET',
    path: '/test-post1',
    handler: (request, h) => {
      return h.response('GET request received').code(200)
    }
  },
  {
    method: 'POST',
    path: '/test-post1',
    options: {
      handler: (request, h) => {
        const payload = JSON.stringify(request.payload, null, 2)
        return h.response(`POST request received with payload:\n${payload}`).code(200)
      }
    }
  }
]
