const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'start'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/farming-type`

function createModel () {
  return {
    startLink: currentPath,
    button: {
      text: 'Start now',
      nextLink: nextPath
    }
  }
}

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: async (request, h) => {
    return h.view(viewTemplate, createModel())
  }
}
