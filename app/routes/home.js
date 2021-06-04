const { setYarValue } = require('../helpers/session')
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
  handler: async (request, h) => {
    setYarValue(request, 'journey-start-time', Date.now())
    return h.view('home', createModel())
  }
}
