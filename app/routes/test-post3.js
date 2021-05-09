module.exports = [
  {
    method: 'GET',
    path: '/test-post3',
    handler: (request, h) => {
      return h.response('GET request received').code(200)
    }
  },
  {
    method: 'POST',
    path: '/test-post3',
    options: {
      handler: (request, h) => {
        const payload = JSON.stringify(request.payload, null, 2)
        console.log(`POST to test-post3 received with payload:\n${payload}`)
        return h.redirect('/test-redirect3')
      }
    }
  }
]
