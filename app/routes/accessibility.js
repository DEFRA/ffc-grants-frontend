module.exports = {
  method: 'GET',
  path: '/accessibility',
  handler: (request, h) => {
    return h.view('./accessibility', { accessibility: 'accessibility' })
  }
}
