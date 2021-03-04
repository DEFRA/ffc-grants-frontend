module.exports = {
  method: 'GET',
  path: '/msg-test2',
  handler: (request, h) => {
    return h.view('message-test2', { message: request.yar.get('serverMsg1') })
  }
}
