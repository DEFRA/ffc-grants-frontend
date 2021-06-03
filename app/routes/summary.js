const createMsg = require('../messaging/create-msg')
function createModel (data) {
  return {
    backLink: './confirm',
    ...data
  }
}

module.exports = [{
  method: 'GET',
  path: '/summary',
  options: {
    log: {
      collect: true
    }
  },
  handler: (request, h, err) => {
    const msg = createMsg.getAllDetails(request, '')
    console.log(msg)
    return h.view('summary', createModel(msg))
  }
},
{
  method: 'POST',
  path: '/summary',
  handler: (request, h) => {
    return h.redirect('./confirm')
  }
}]
