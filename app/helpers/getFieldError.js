
const getFieldError = (errorList, href) => {
  return errorList && errorList.some(err => err.href === href) ? errorList.find(err => err.href === href).text : null
}
module.exports = {
  getFieldError
}
