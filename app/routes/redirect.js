module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, h) => h.redirect('./start')
}
