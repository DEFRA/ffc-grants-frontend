const urlPrefix = require('../config/server').urlPrefix
const { questionBank } = require('../config/question-bank-redux')
const { getHandler, getPostHandler } = require('../helpers/handlers')

const drawSectionGetRequests = (q) => {
  return {
    method: 'GET',
    path: `${urlPrefix}/${q.url}`,
    handler: getHandler(q)
  }
}

const drawSectionPostRequests = (q) => {
  return {
    method: 'POST',
    path: `${urlPrefix}/${q.url}`,
    handler: getPostHandler(q)
  }
}

let pages = questionBank.questions.map(q => drawSectionGetRequests(q))
pages = [ ...pages, ...questionBank.questions.map(q => drawSectionPostRequests(q)) ]
module.exports = pages
