module.exports = {
  method: 'GET',
  path: '/accessibility',
  options: {
    handler: (request, h) => {
      return h.view('./accessibility')
    }
  }
}
