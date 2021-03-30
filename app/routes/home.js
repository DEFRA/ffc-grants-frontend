function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: '/water/farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/water/start',
  handler: (request, h) => {
    request.yar.reset()
    return h.view('home', createModel())
  }
}
