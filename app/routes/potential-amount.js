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
    path: '/potential-amount',
    handler: (request, h) => {
      const calculatedGrant = request.yar.get('calculatedGrant') || null
      const projectCost = request.yar.get('projectCost') || null

      if (!calculatedGrant || !projectCost) {
        return h.redirect('./project-cost')
      }

      const formattedGrant = formatUKCurrency(calculatedGrant)
      const formattedProjectCost = formatUKCurrency(projectCost)

      return h.view('potential-amount', createModel(formattedGrant, formattedProjectCost))
    }
  },
  {
    method: 'POST',
    path: '/potential-amount',
    handler: (request, h) => {
      return h.redirect('./remaining-costs')
    }
  }
]
