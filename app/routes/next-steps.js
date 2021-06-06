const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'next-steps'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/score`
const nextPath = `${urlPrefix}/business-details`

function createModel () {
  return {
    backLink: previousPath,
    nextLink: nextPath
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      return h.view(viewTemplate, createModel())
    }
  }
]
