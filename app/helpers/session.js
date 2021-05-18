function setYarValue (request, key, value) {
  request.yar.set(key, value)
}

function getYarValue (request, key) {
  return request.yar.get(key)
}

module.exports = {
  setYarValue,
  getYarValue
}
