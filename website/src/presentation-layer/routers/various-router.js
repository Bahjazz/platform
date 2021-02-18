const express = require('express')

module.exports = function () {

    const router = express.Router()
    //router.get("/", function (request, response) {
        //response.render("home.hbs")
   // })
    router.get("/community", function (request, response) {
        response.render("community.hbs")
    })
    router.get("/contact", function (request, response) {
        response.render("contact.hbs")
    })

  
  router.get("/home", function (request, response) {
    response.render("home.hbs")
  }) 
   /*
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

    return router
}