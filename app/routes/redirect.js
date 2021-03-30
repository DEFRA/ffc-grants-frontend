module.exports = {
  method: 'GET',
  path: '/water',
  handler: (request, h) => h.redirect('/water/start')
}
