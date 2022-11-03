const { formatUKCurrency } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const viewTemplate = 'potential-amount'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/project-cost`
const nextPath = `${urlPrefix}/remaining-costs`
const { MAX_GRANT } = require('../helpers/grant-details')
function createModel (calculatedGrant, projectCost) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    calculatedGrant,
    projectCost
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const calculatedGrant = getYarValue(request, 'calculatedGrant') || null
      const projectCost =  getYarValue(request, 'projectCost') || null
      if (!calculatedGrant || !projectCost) {
        return h.redirect(previousPath)
      }

      const formattedGrant = calculatedGrant > MAX_GRANT ?
        formatUKCurrency(MAX_GRANT) : formatUKCurrency(calculatedGrant);
      const formattedProjectCost = formatUKCurrency(projectCost)

      return h.view(viewTemplate, createModel(formattedGrant, formattedProjectCost))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    handler: (request, h) => {
      return h.redirect(nextPath)
    }
  }
]
