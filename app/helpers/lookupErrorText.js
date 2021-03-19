const errors = {
    'error.inEngland.any.required': 'Select yes if the project is in England',
    'error.projectPostcode.string.pattern.base': 'Enter a postcode, like AA1 1AA',
    'error.projectPostcode.string.empty': 'Enter a postcode, like AA1 1AA'

}
const lookupErrorText = (key) => {
    return errors[key] || key;
  };

module.exports = lookupErrorText;
