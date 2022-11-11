const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-grants-frontend',
    ...options
  }
}

module.exports = createMessage
