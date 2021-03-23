const express = require('express')
const path = require("path")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require("express-session")
const expressHandlebars = require('express-handlebars')
const RedisStore = require('connect-redis')(session)
const redis = require("redis");
const redisClient = redis.createClient(6379,'redis')
 


//const mongoStore = require("connect-mongo").default

//const dbURI = "mongodb+srv://kdramaUnited:drama@cluster0.ajqfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


module.exports = function ({variousRouter,accountRouter, dramaRecensionRouter,dramaRouter}) {

  const app = express()
  //Setup exports-handlebars
  app.set('views', path.join(__dirname, 'views'))

  app.engine("hbs", expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'layouts')
  }))
  
   
 app.use (cookieParser())

 
app.use(session({
    store: new RedisStore({ host: redis, port: 6379 , client: redisClient }),
    secret: 'keyboard cat',
    resave: false,
  })
)
 
  
  app.use(function (request, response, next) {
    const isLoggedIn = request.session.isLoggedIn
    response.locals.isLoggedIn = isLoggedIn
    next()
  })

  
  /*
app.use(express.urlencoded({
  extended: false
}))
*/


  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // attch all router 
  app.use('/', variousRouter)
  app.use('/accounts', accountRouter)
  app.use('/drama-recensions',dramaRecensionRouter )
  app.use('/dramas', dramaRouter)

  app.use('/css', express.static(path.join(__dirname, 'css')))
  app.use('/public', express.static(path.join(__dirname, 'public')))
  app.use('/images', express.static(path.join(__dirname, 'images')))

  return app
}


