const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'start'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/farming-type`
const copyprovider = (key) => {
  const copy = {
    1: "Check if you can apply for a Water Management Grant",
    2: "Use this service to:",
    3: "check if you can apply for a grant for your project (takes about 5 minutes)",
    4: "check how well your project fits the funding priorities (takes about 15 minutes if you have all the project details)",
    5: "Who can apply",
    6: "You can apply if you:",
    7: "grow crops for the food industry, are a nursery growing ornamentals or are a forestry nursery",
    8: "will do the grant-funded work in England",
    9: "estimate the project costs will be over £87,500",
    10: "If your project is eligible, you can submit your answers to the Rural Payments Agency (RPA) to request the full application form.",
    11: "Start now",
    12: "Before you start",
    13: "You need:",
    14: "information about your business (for example, number of employees and turnover)",
    15: "information about the project (for example, irrigated land in hectares)",
    16: "an estimated total cost of the items you need",
    17: "If you do not enter any information for more than 20 minutes, your application will time out and you will have to start again.",
    18: "Problems using the online service",
    19: "If you have any problems using the online service, contact the RPA.",
    20: "Telephone",
    21: "Telephone: 0300 0200 301",
    22: "Monday to Friday, 9am to 5pm (except public holidays)",
    23: "Find out about call charges",
    24: "(opens in a new tab)",
    25: "Email",
    26: "FTF@rpa.gov.uk",
  }
  return copy[key];
}
function createModel () {
  return {
    startLink: currentPath,
    copyprovider: copyprovider,
    button: {
      text: 'Start now',
      nextLink: nextPath
    }
  }
}

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: async (request, h) => {
    return h.view(viewTemplate, createModel())
  }
}
