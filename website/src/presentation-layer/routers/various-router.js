const express = require('express')

module.exports = function () {

  const router = express.Router()
  
  router.get("/home", function (request, response) {
    response.render("home.hbs")
  })
  router.get('/', function (request, response) {
    response.redirect("/dramas")
  })
  router.get("/contact", function (request, response) {
    response.render("contact.hbs")
  })

  return router
}