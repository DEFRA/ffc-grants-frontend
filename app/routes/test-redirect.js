module.exports = [
  {
    method: 'GET',
    path: '/test-redirect',
    handler: (request, h) => {
      return h.response('You were redirected here from test-post2').code(200)
    }
  }
]
