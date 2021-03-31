module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, h) => h.response('hello from test-ingress').code(200)
}
