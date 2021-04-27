afterEach(async () => {
  await global.__SERVER__.stop()
  require('applicationinsights').dispose()
})
