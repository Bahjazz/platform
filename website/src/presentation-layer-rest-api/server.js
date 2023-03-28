const express = require('express')
const bodyParser = require('body-parser')

module.exports = function ({ accountRouterApi, dramaRouterApi }) {

    const server = express()
     
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({
        extended:false
    }))

    server.use(function (request, response, next) {

        response.setHeader("Access-Control-Allow-Origin", "*")
        response.setHeader("Access-Control-Allow-Methods", "*")
        response.setHeader("Access-Control-Allow-Headers", "*")
        response.setHeader("Access-Control-Allow-Expose-Headers", "*")

        next()
    })


    server.use('/dramas', dramaRouterApi)
    server.use('/accounts', accountRouterApi)



    return server
}