module.exports = [
  {
    method: 'GET',
    path: '/test-post2',
    handler: (request, h) => {
      return h.response('GET request received').code(200)
    }
  },
  {
    method: 'POST',
    path: '/test-post2',
    options: {
      handler: (request, h) => {
        const payload = JSON.stringify(request.payload, null, 2)
        console.log(`POST to test-post2 received with payload:\n${payload}`)
        return h.redirect('./test-redirect')
      }
    }
  }
]
