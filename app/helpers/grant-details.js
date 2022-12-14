const MIN_GRANT = 35000
const MAX_GRANT = 9999999  // double check this, changed to match unit tests
const GRANT_PERCENTAGE = 40
const NAME_ONLY_REGEX = /^[a-zA-Z,' -]*$/
module.exports = {
  MIN_GRANT,
  MAX_GRANT,
  GRANT_PERCENTAGE,
  NAME_ONLY_REGEX
}
