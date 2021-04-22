
function createModel () {
  return {
    backLink: '/score'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/next-steps',
    handler: (request, h) => {
      return h.view(
        'next-steps',
        createModel()
      )
    }
  }
]
