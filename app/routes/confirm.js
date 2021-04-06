function createModel (errorMessage, data) {
  return {
    backLink: '/score',
    inputConfirm: {
      id: 'confirm',
      name: 'confirm',
      classes: 'govuk-input--width-10',
      label: {
        text: '[Placeholder] - /confirm',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        html: `
            Page yet to be built.
            <br/>
            Remember to adjust the links: < form action, back, redirect >
          `
      }
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/confirm',
    handler: (request, h) => {
      return h.view('confirm', createModel())
    }
  },
  {
    method: 'POST',
    path: '/confirm',
    handler: (request, h) => {
      return h.redirect('./confirm')
    }
  }
]
