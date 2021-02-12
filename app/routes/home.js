function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: '/arable'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    request.yar.reset()
    return h.view('home', createModel())
  }
}
