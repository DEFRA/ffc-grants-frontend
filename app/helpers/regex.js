const CURRENCY_FORMAT = /^(\d+|\d{1,3}(,\d{3})+)$/
const CHARS_MAX_10 = /^.{1,10}$/
const CHARS_MIN_10 = /^.{10,}$/
const CHARS_MAX_50 = /^.{1,50}$/
const CHARS_MAX_100 = /^.{0,100}$/
const WORDS_MAX_60 = /^(?:\b\w+\b[\s.',-]*){1,60}$/
const WHOLE_NUMBER_REGEX = /^\d+$/
const DIGITS_MAX_10 = /^\d{1,10}$/
const SBI_REGEX = /^(\d{0}|\d{9})$/
const SELECT_VARIABLE_TO_REPLACE = /{{_(.+?)_}}/ig
const DELETE_POSTCODE_CHARS_REGEX = /[)(.\s-]*/g
const POSTCODE_REGEX = /^\s*[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}\s*$/i
const NAME_ONLY_REGEX = /^[a-zA-Z,' -]*$/
const PHONE_REGEX = /^\+?[0-9\[\s\(\)\]\-]{10,}$/
const EMAIL_REGEX = /^\w+([.-](\w+))*@[a-zA-Z0-9]+([_-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,5})+$/
const ADDRESS_REGEX = /^[a-zA-Z0-9' -]*$/
const ONLY_TEXT_REGEX = /^[a-zA-Z\s]+$/
const PLANNING_REFERENCE_NUMBER_REGEX = /^[a-zA-Z0-9\/]{1,50}$/
const LETTERS_AND_NUMBERS_REGEX = /^[a-zA-Z0-9]{1,10}$/
const TWO_NUMBERS_EIGHT_CHARS = /^[a-zA-Z]{2}\d{8}$/
const COMMA_EXCLUDE_REGEX = /^[^,]*(?!,)$/g // check
const DECIMAL_EXCLUDE_REGEX = /^[^.]*(?!.)$/g // check

module.exports = {
  CURRENCY_FORMAT,
  CHARS_MAX_10,
  CHARS_MIN_10,
  CHARS_MAX_100,
  WORDS_MAX_60,
  CHARS_MAX_50,
  SELECT_VARIABLE_TO_REPLACE,
  DELETE_POSTCODE_CHARS_REGEX,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  SBI_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  ONLY_TEXT_REGEX,
  PLANNING_REFERENCE_NUMBER_REGEX,
  LETTERS_AND_NUMBERS_REGEX,
  TWO_NUMBERS_EIGHT_CHARS,
  DIGITS_MAX_10,
  COMMA_EXCLUDE_REGEX,
  DECIMAL_EXCLUDE_REGEX,
  ADDRESS_REGEX
}
