const { formatUKCurrency } = require('../helpers/helper-functions')

function createModel (calculatedGrant, projectCost) {
  return {
    backLink: './project-cost',
    calculatedGrant,
    projectCost
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/grant',
    handler: (request, h) => {
      const calculatedGrant = request.yar.get('calculatedGrant') || null
      const projectCost = request.yar.get('projectCost') || null

      if (!calculatedGrant || !projectCost) {
        return h.redirect('./project-cost')
      }

      const formattedGrant = formatUKCurrency(calculatedGrant)
      const formattedProjectCost = formatUKCurrency(projectCost)

      return h.view(
        'grant',
        createModel(formattedGrant, formattedProjectCost)
      )
    }
  },
  {
    method: 'POST',
    path: '/grant',
    handler: (request, h) => {
      return h.redirect('./remaining-costs')
    }
  }
]
