const POSTCODE_REGEX = /^[a-z]{1,2}\d[a-z\d]?\s\d[a-z]{2}$/i
const PHONE_REGEX = /^[0-9\t-+()]+$/
const NAME_REGEX = /^[^0-9]+$/
const NUMBER_REGEX = /^\d+$/
const IRRIGATED_LAND_REGEX = /^\d{1,3}([.]\d?)?$/

module.exports = {
  POSTCODE_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  IRRIGATED_LAND_REGEX
}
