const fs = require('fs')
const path = require('path')

module.exports = fs.readdirSync(__dirname)
  .filter(file => file !== path.basename(__filename))
  .map(file => require(`./${file}`))
  .flat()
