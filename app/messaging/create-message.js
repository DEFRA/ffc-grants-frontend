const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-grants-cattle-housing-web',
    ...options
  }
}

module.exports = createMessages
