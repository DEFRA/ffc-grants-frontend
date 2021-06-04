const createMsg = require('../messaging/create-msg')
function createModel (data) {
  return {
    backLink: './farmer-details',
    ...data
  }
}

module.exports = [{
  method: 'GET',
  path: '/check-details',
  options: {
    log: {
      collect: true
    }
  },
  handler: (request, h, err) => {
    const msg = createMsg.getAllDetails(request, '')
    console.log(msg)
    return h.view('check-details', createModel(msg))
  }
},
{
  method: 'POST',
  path: '/check-details',
  handler: (request, h) => {
    console.log('Redirect')
    return h.redirect('./confirm')
  }
}]
