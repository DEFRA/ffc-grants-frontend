const POSTCODE_REGEX = /^[\s]*[a-z]{1,2}\d[a-z\d]?[\s]*\d[a-z]{2}[\s]*$/i
const DELETE_POSTCODE_CHARS_REGEX = /[)(.\s-]*/g
const PHONE_REGEX = /^[0-9\t-+()]+$/
const NAME_REGEX = /^[a-zA-Z' -]+$/
const NUMBER_REGEX = /^\d+$/
const PROJECT_COST_REGEX = /^[1-9][0-9]*$/
const IRRIGATED_LAND_REGEX = /^\d{1,3}([.]\d?)?$/

module.exports = {
  POSTCODE_REGEX,
  DELETE_POSTCODE_CHARS_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  PROJECT_COST_REGEX,
  IRRIGATED_LAND_REGEX
}
