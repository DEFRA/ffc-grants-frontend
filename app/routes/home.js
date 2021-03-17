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
    const xFF = request.headers['x-forwarded-for']
    const ip = xFF ? xFF.split(',')[0] : request.info.remoteAddress
    console.log(xFF)
    console.log(ip)
    console.log('*** **** ***')

    return h.view('home', createModel())
  }
}
