const POSTCODE_REGEX = /^\s*[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}\s*$/i
const DELETE_POSTCODE_CHARS_REGEX = /[)(.\s-]*/g
const PHONE_REGEX = /^[0-9\{\[\(\)\}\]— +]+$/
const NAME_REGEX = /^[a-zA-Z' ,’-]+$/
const BUSINESSNAME_REGEX = /^[a-zA-Z0-9' ,’-]+$/
const NUMBER_REGEX = /^\d+$/
const PROJECT_COST_REGEX = /^[1-9]\d*$/
const IRRIGATED_LAND_REGEX = /^(\d+([.]\d?)?|[.]\d)$/
const ONLY_ZEROES_REGEX = /^0+$/
const ADDRESS_REGEX = /^[a-zA-Z0-9' -]*$/
const TOWN_REGEX = /^[a-zA-Z -]+$/
const SBI_REGEX = /^(\d{0}|\d{9})$/
const ONLY_TEXT_REGEX = /^[a-zA-Z\s]+$/
const CHARS_MIN_10 = /^.{10,}$/
const EMAIL_REGEX = /^\w+([.-](\w+))*@[a-zA-Z0-9]+([_-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,5})+$/



module.exports = {
  POSTCODE_REGEX,
  DELETE_POSTCODE_CHARS_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
  BUSINESSNAME_REGEX,
  NUMBER_REGEX,
  PROJECT_COST_REGEX,
  IRRIGATED_LAND_REGEX,
  ONLY_ZEROES_REGEX,
  TOWN_REGEX,
  ADDRESS_REGEX,
  SBI_REGEX,
  ONLY_TEXT_REGEX,
  CHARS_MIN_10,
  EMAIL_REGEX
}
