const express = require("express")

module.exports = function({app, api}){
    const server = express()

    server.use('/api',api)     
    server.use('/',app)

    return server
}
