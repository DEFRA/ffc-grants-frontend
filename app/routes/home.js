function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: '/slurry/farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/slurry/start',
  handler: (request, h) => {
    request.yar.reset()
    return h.view('home', createModel())
  }
}
