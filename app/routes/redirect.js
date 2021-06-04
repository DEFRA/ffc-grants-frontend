module.exports = {
  method: 'GET',
  path: '/{p?}',
  handler: (request, h) => h.redirect('/water/start')
}
