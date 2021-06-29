
function addSummaryRow (object, request) {
  return {
    key: object.key,
    answers: [
      {
        key: object.key,
        title: object.pageTitle,
        input: [{ value: request.yar.get(object.yarKey) }]
      }],
    title: object.title,
    desc: object.desc ?? '',
    url: object.url,
    order: object.order,
    unit: object?.unit,
    pageTitle: object.pageTitle,
    fundingPriorities: object?.fundingPriorities
  }
}

module.exports = {
  addSummaryRow
}
