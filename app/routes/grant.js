function createModel (calculatedGrant, projectCost) {
  return {
    backLink: '/project-cost',
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

      return h.view(
        'grant',
        createModel(calculatedGrant, projectCost)
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
