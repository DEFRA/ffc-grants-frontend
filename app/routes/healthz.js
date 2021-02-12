module.exports = {
  method: 'GET',
  path: '/healthz',
  handler: (request, h) => {
    return h.response('ok').code(200)
  }
}
