function createModel (errorMessage, data) {
  return {
    backLink: '/collaboration',
    inputScore: {
      id: 'score',
      name: 'score',
      classes: 'govuk-input--width-10',
      label: {
        text: '[Placeholder] - /score',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        html: 'Page yet to be built'
      }
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/score',
    handler: (request, h) => {
      return h.view('score', createModel())
    }
  },
  {
    method: 'POST',
    path: '/score',
    handler: (request, h) => {
      return h.redirect('./business-details')
    }
  }
]
