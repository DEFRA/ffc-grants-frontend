const MAYBE_ELIGIBLE = {
  backLink: './abstraction-licence',
  nextLink: './project-details',
  messageHeader: 'You may be able to apply for this grant',
  messageContent: `
  Any abstraction licences or variations must be in place by 31 December 2021 (the end of the application window).<br/><br/>
  If you have already applied for an abstraction licence or variation and expect to get it by then, you can submit a full application.<br/><br/>
  If you have already applied for an abstraction licence or variation but it might not be issued by then, please email<a href="mailto:FTF@rpa.gov.uk">FTF@rpa.gov.uk</a> 
  `
}

module.exports = [
  {
    method: 'GET',
    path: '/abstraction-required-condition',
    handler: (request, h) => {
      return h.view('maybe-eligible', MAYBE_ELIGIBLE).takeover()
    }
  }
]
