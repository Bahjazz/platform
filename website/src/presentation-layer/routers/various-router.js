const express = require('express')
const app = require('../app')

module.exports = function () {

  const router = express.Router()
  
  router.get("/home", function (request, response) {
    response.render("home.hbs")
  })
 
  router.get("/contact", function (request, response) {
    response.render("contact.hbs")
  })

  router.get("/drama-recension", function (request, response) {
    response.render("drama-recension-create.hbs")
  })
  
  
  router.get("/drama", function (request, response) {
    response.render("drama-create.hbs")
  })
  
  return router
}