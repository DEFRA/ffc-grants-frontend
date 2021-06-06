const { formatUKCurrency } = require('../helpers/helper-functions')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'potential-amount'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/project-cost`
const nextPath = `${urlPrefix}/remaining-costs`

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
      const calculatedGrant = request.yar.get('calculatedGrant') || null
      const projectCost = request.yar.get('projectCost') || null

      if (!calculatedGrant || !projectCost) {
        return h.redirect(previousPath)
      }

      const formattedGrant = formatUKCurrency(calculatedGrant)
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
