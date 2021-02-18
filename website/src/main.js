const awilix = require('awilix')

const container = awilix.createContainer()
container.register({
accountRepository: awilix.asFunction(require('./data-access-layer/account-repository')),
accountManager: awilix.asFunction(require('./business-logic-layer/account-manager')),
accountRouter: awilix.asFunction(require('./presentation-layer/routers/account-router')),
variousRouter: awilix.asFunction(require('./presentation-layer/routers/various-router')),
app: awilix.asFunction(require('./presentation-layer/app'))
})


const app = container.resolve("app")

app.listen(8080, function () {
    console.log("started as port 8080")
  
  
  })

  