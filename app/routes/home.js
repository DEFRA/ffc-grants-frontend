const { setYarValue } = require('../helpers/session')
function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: './farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/start',
  handler: async (request, h) => {
    setYarValue(request, 'journey-start-time', Date.now())
    return h.view('home', createModel())
  }
}
