const urlPrefix = require('../config/server').urlPrefix

const MAYBE_ELIGIBLE = {
  backLink: `${urlPrefix}/abstraction-licence`,
  nextUrl: `${urlPrefix}/irrigation-status`,
  messageHeader: 'You may be able to apply for this grant',
  messageContent: `
  Any abstraction licences or variations must be in place by 31 January 2024.
  <div class="govuk-inset-text">If you have already applied for an abstraction licence or variation and expect to get it by then, you can submit a full application.</div>
  <p class="govuk-body">If you have already applied for an abstraction licence or variation but it might not be issued by then, please email <a class="govuk-link" href="mailto:FTF@rpa.gov.uk">FTF@rpa.gov.uk</a></p>
  
  `
}

module.exports = [
  {
    method: 'GET',
    path: `${urlPrefix}/abstraction-required-condition`,
    handler: (request, h) => {
      return h.view('maybe-eligible', MAYBE_ELIGIBLE)
    }
  }
]
