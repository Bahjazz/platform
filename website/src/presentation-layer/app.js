const path = require("path")
const express = require('express')


const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

module.exports = function ({variousRouter,accountRouter}) {

  const app = express()
  //Setup exports-handlebars
  app.set('views', path.join(__dirname, 'views'))

  app.engine("hbs", expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'layouts')
  }))
  //handle static files in the public folder
  
  //app.use(express.static(path.join(__dirname, 'public')))




app.use(express.urlencoded({
  extended: false
}))
/*
app.get("/home", function (request, response) {
  response.render("home.hbs")
})
app.get("/community", function (request, response) {
  response.render("community.hbs")
})
app.get('/', function (request, response) {
  response.render("home.hbs")
})
app.get('/contact', function (request, response) {
  response.render('contact.hbs')
})
*/
  app.use(bodyParser.urlencoded())

  // attch all router 
  app.use('/', variousRouter)
  app.use('/accounts', accountRouter)

  app.use('/css', express.static(path.join(__dirname, 'css')))
  app.use('/public', express.static(path.join(__dirname, 'public')))
  app.use('/images', express.static(path.join(__dirname, 'images')))

  return app
}


console.log("Bahja, I restart the programm myself")
