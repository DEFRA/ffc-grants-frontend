const MAYBE_ELIGIBLE = {
  backLink: './abstraction-licence',
  postUrl: './abstraction-caveat',
  messageContent: `
  Any abstraction licences should be in place by 31 December 2021 (the end of the application window).<br/><br/>
  If you have already applied for an abstraction licence and expect to get it by then, you can submit a full application.<br/><br/>
  If you have already applied for an abstraction licence but it might not be issued by then, please email <a href="mailto:FTF@rpa.gov.uk">FTF@rpa.gov.uk</a> 
  `
}

module.exports = [
  {
    method: 'GET',
    path: '/abstraction-caveat',
    handler: (request, h) => {
      return h.view('maybe-eligible-form', MAYBE_ELIGIBLE).takeover()
    }
  },
  {
    method: 'POST',
    path: '/abstraction-caveat',
    handler: (request, h) => {
      return h.redirect('./SSSI')
    }
  }
]
