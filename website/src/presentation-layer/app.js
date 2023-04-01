const express = require('express')
const path = require("path")
const bodyParser = require('body-parser')
const session = require("express-session")
const expressHandlebars = require('express-handlebars')
const csurf = require('csurf')
const RedisStore = require('connect-redis')(session)
const redis = require("redis");
const redisClient = redis.createClient(6379,'redis')


module.exports = function ({variousRouter,accountRouter, dramaRecensionRouter,dramaRouter}) {

  const app = express()

  app.engine("hbs", expressHandlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'layouts')
  }))

  app.use(bodyParser.urlencoded({
    extended: false
  }))

 
  app.use(session({
    store: new RedisStore({ host: redis, port: 6379 , client: redisClient }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
)


  app.use(function (request, response, next) {
    const isLoggedIn = request.session.isLoggedIn
    response.locals.isLoggedIn = isLoggedIn
    next()
})
  
  app.use(csurf())

  app.use(function(request, response, next) {
    response.locals.csrfToken = request.csrfToken()
    next()
})
  app.set('views', path.join(__dirname, 'views'))

  app.use('/css', express.static(path.join(__dirname, 'css')))
  app.use('/public', express.static(path.join(__dirname, 'public')))
  app.use('/images', express.static(path.join(__dirname, 'images')))

  app.use('/', variousRouter)
  app.use('/accounts', accountRouter)
  app.use('/dramaRecensions',dramaRecensionRouter )
  app.use('/dramas', dramaRouter)
  
  return app
}


