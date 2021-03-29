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
      return h.redirect('./project-details')
    }
  }
]
