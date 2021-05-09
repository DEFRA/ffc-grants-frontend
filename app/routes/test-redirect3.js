module.exports = [
  {
    method: 'GET',
    path: '/test-redirect3',
    handler: (request, h) => {
      return h.response('You were redirected here from test-post3').code(200)
    }
  }
]
