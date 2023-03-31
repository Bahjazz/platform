const express = require('express')

module.exports = function () {

  const router = express.Router()
  
  router.get("/home", function (request, response) {
    response.render("home.hbs")
  })
  router.get('/', function (request, response) {
    response.redirect("/dramas")
  })
  

  return router
}