const awilix = require('awilix')

const container = awilix.createContainer()

container.register({

  accountManager: awilix.asFunction(require('./business-logic-layer/account-manager')),
  dramaRecensionManager: awilix.asFunction(require('./business-logic-layer/drama-recension-manager')),
  dramaManager: awilix.asFunction(require('./business-logic-layer/drama-manager')),

  
  accountRepository: awilix.asFunction(require('./data-access-layer/account-repository')),
  dramaRecensionRepository: awilix.asFunction(require('./data-access-layer/drama-recension-repository')),
  dramaRepository: awilix.asFunction(require('./data-access-layer/drama-repository')),


 
  accountRouter: awilix.asFunction(require('./presentation-layer/routers/account-router')),
  variousRouter: awilix.asFunction(require('./presentation-layer/routers/various-router')),
  dramaRecensionRouter: awilix.asFunction(require('./presentation-layer/routers/drama-recension-router')),
  dramaRouter: awilix.asFunction(require('./presentation-layer/routers/drama-router')),
 


  api: awilix.asFunction(require('./presentation-layer-rest-api/server')),
  app: awilix.asFunction(require('./presentation-layer/app')),

  
  server:awilix.asFunction(require("./server")),

  accountRouterApi: awilix.asFunction(require('./presentation-layer-rest-api/account-router')),
  dramaRouterApi: awilix.asFunction(require('./presentation-layer-rest-api/drama-router')),


})

const app = container.resolve("app")
app.listen(3000, function () {
  console.log("started as port 3000")
})

