const express = require('express')
const ACCESS_TOKEN_SECRET = "babbababbsdvv"
const jsonwebtoken = require('jsonwebtoken')

module.exports = function ({ dramaManager }) {
    const router = express.Router()

    function getUserIfSignedIn(requestHeader){
        let signedIn
        const authorizationHeader = requestHeader
        const accessToken = authorizationHeader.substring("Bearer ".length)
        jsonwebtoken.verify(accessToken,ACCESS_TOKEN_SECRET, function(error, payload) {
            if(error){
                const result = {
                    userID: null,
                    isLoggedIn:false,
                    username:null
                }
                signedIn = result   
            }
            signedIn = payload;
        })
        return signedIn
    } 
  router.get("/", function (request, response) {
        dramaManager.getAllDramas(function (errors, dramas) {
            if (errors.length > 0) {
                if(errors ==  "internalError"){                
                   response.status(500).json(errors)
                }else{
                    response.status(400).end(errors)
                }
            } else {
                response.status(200).json(dramas)
            }
        })
    })
    router.post("/", function (request, response) {
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        const drama = {
            name: request.body.name,
            description: request.body.description,
            accountID:signedInUser.userID
        }
        dramaManager.createDrama(drama, function (errors, id) {
            if (errors.length == 0) {
                response.status(201).json(drama)
            } else {
                if (errors == "internalError") {
                    response.status(500).json(errors)
                }
                if(errors == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')
                }else{
                    response.status(400).end(errors)
                }
            }

        })
    })
    router.get('/:id', function(request, response){
        const id = request.params.id
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        dramaManager.getDramaById(signedInUser, id, function(errors, drama){
            if(errors.length == 0){
                response.status(200).json([drama,signedInUser])
            }else{
                if (errors == "internalError") {
                    response.status(500).json(errors)
                }
                if(errors == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')
            }else{
                response.status(400).json(errors)
            }
          }
        })
    })
  
       

    router.put('/', function (request, response) {
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        const drama = {
            dramaID: request.body.dramaID,
            name: request.body.name,
            description: request.body.description,
            accountID:request.body.accountID
        }
        dramaManager.updateDrama(signedInUser, drama, function (errors) {
            if (error.length == 0) {
                response.setHeader("Location", "/dramas/" + request.body.dramaID)
                response.status(204).end()
            } else {
                if (errors == "internalError") {
                    response.status(500).json(errors)
                }
                if(errors == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')
                }else{
                    response.status(400).json(errors)
                }
            }
        })

    })

    router.delete("/", function (request, response) {
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        const id =request.body.dramaID
        dramaManager.deleteDramaById(signedInUser, id, function (errors) {
            if (errors.length == 0) {
                response.setHeader("Location", "/dramas/" + id)
                response.status(200).json(id)
            } else {
                if (errors == "internalError") {
                    response.status(500).json(errors)
                }
                if(errors == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')
                }else{
                 response.status(400).json(errors)
                }

            }
        })
    })

    return router
}