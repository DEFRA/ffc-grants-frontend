
function crumbCookieRegEx () {
  return /crumb=([^\x00-\x20\"\,\;\\\x7F]*)/
}
function getCookieHeader (response) {
  return response.headers['set-cookie']
}
function getCrumbCookie (response) {
  const header = getCookieHeader(response)
  return header[0].match(crumbCookieRegEx())
}
module.exports = {
  crumbCookieRegEx,
  getCookieHeader,
  getCrumbCookie
}
