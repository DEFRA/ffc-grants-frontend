function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: '/farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/start',
  handler: (request, h) => {
    request.yar.reset()

    console.log('*** CLIENT IP: ***')
    console.log(request.info.remoteAddress)
    console.log('*** **** ***')

    return h.view('home', createModel())
  }
}
