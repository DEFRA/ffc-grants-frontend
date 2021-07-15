module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    auth: false,
    handler: (request, h) => {
      return h.response('ok').code(200)
    }
  }
}
