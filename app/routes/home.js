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
  handler: async (request, h) => {
    request.yar.reset()
    console.log(`GOT REQUEST ${request.yar.id}`)
    await request.ga.event({
      category: 'Session',
      action: 'Start'
    })
    return h.view('home', createModel())
  }
}
