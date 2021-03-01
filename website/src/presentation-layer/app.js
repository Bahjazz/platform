const express = require('express')
const path = require("path")
const bodyParser = require('body-parser')

const expressSession = require("express-session")
const expressHandlebars = require('express-handlebars')

//const mongoStore = require("connect-mongo").default

//const dbURI = "mongodb+srv://bahjakdrama:kdrama@cluster0.ajqfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//const mongoose = require("mongoose")

module.exports = function ({variousRouter,accountRouter, dramaRecensionRouter}) {

  const app = express()
  //Setup exports-handlebars
  app.set('views', path.join(__dirname, 'views'))

  app.engine("hbs", expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'layouts')
  }))
  
/*
  app.use(expressSession({
    secret: "absdefdshjdjfvcbvcvhh",
    /*saveUninitialized: false,
    resave: false,
    store: mongoStore.create({
      mongoUrl: dbURI,
      collection: 'kdramaSessions'
    })
  }))
  
*/
/*
  app.use(function (request, response, next) {
    const isLoggedIn = request.session.isLoggedIn
    response.session.isLoggedIn = isLoggedIn
    next()
  })
  */
app.use(express.urlencoded({
  extended: false
}))

  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // attch all router 
  app.use('/', variousRouter)
  app.use('/accounts', accountRouter)
  app.use('/drama-recensions',dramaRecensionRouter )

  app.use('/css', express.static(path.join(__dirname, 'css')))
  app.use('/public', express.static(path.join(__dirname, 'public')))
  app.use('/images', express.static(path.join(__dirname, 'images')))

  return app
}


