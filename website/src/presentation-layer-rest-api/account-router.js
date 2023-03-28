const express = require('express')
const { json } = require('express/lib/response')
const USERNAME_LENGTH = 4
const ACCESS_TOKEN_SECRET = "babbababbsdvv"
const jsonwebtoken = require('jsonwebtoken')

module.exports = function ({ accountManager }) {
    const router = express.Router()

    function getUserIfSignedIn(requestHeader){
        let signedIn
        const authorizationHeader = requestHeader
        const accessToken = authorizationHeader.substring("Bearer ".length)
        jsonwebtoken.verify(accessToken,ACCESS_TOKEN_SECRET, function(error, payload) {
            if(error){
                signedIn = null   
            }
            signedIn = payload
        })
        return signedIn
    } 

    router.get("/", function (request, response) {
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        accountManager.getAllAccounts(signedInUser,function (errors, accounts) {
            if (errors.length > 0) {
                if(errors == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')
                }
                response.status(500).json(errors)
            } else {
                response.status(200).json(accounts)
            }
        })
    })

    router.post("/", function (request, response) {
        const account = {
            username: request.body.username,
            password: request.body.password

        }
        accountManager.createAccount(account, function (error, id) {
                if (error.length == 0) {
                    response.setHeader("Location", "/accounts/" + id)
                    result ={
                        accountID: id,
                        username:account.username
                    }
                    response.status(201).json(result)
                } else {
                    const errorTranslations = {
                        usernameTooShort: "this username need to be at least" + USERNAME_LENGTH + "characters.",
                        usernameTooLong: "this username is too long",
                        internalError: "cant query out the request now",
                        usernameTaken: "Username already in use.",
                        passwordTooShort:"password can't be empty"
                    }
                    const errorMessages = error.map(e => errorTranslations[e])
                    if (error == "internalError") {
                        response.status(500).json(errorMessages)
                    } else {
                        response.status(403).json(errorMessages)
                    }
                }
            })
    })

     router.put("/", function (request, response) {
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        const account = {
             accountID: signedInUser.userID,
       
        }
        accountManager.updateAccount(signedInUser,account, function (error) {
            if (error.length == 0) {
                response.setHeader("Location", "/accounts/" + account.accountID)
                response.status(201).json(account)
            } else { 
                if (errors == "internalError") {
                    response.status(500).end()
                }
                if(error == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')

                } else {
                    response.status(400).end(error)
                }
            }

        })
    })

    router.delete("/", function (request, response) {
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        accountManager.deleteAccountById(signedInUser, function(error){ 
            if (error.length == 0) {
                response.setHeader("Location", "/accounts/" + signedInUser.userID)
                const result ={
                    userID: signedInUser.userID,
                    username: signedInUser.username
                }  
                response.status(200).json(result)
            } else { 
                if (errors == "internalError") {
                    response.status(500).end()
                }
                if(error == "YouNeedToLogIn"){
                    response.status(401).json('Are you sure that you are signed in ?')
                } else {
                response.status(400).end(error)
            }
          }

        })

    })
    router.post("/tokens", function (request, response){
        const data ={
            username: request.body.username,
            password:request.body.password
        }
        accountManager.logIn(data,function(error,account){
            if(error.length == 0){
                const payload ={
                    isLoggedIn: true,
                    userID: account.userID,
                    username:account.username
                }
                jsonwebtoken.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn: '1d'}, function(erro,token){
                     if(erro){
                         response.status(401).json({error:"Not reachable"})
                     }else{
                         const result = {
                             access_token: token,
                             user:account
                         }
                         response.status(200).json(result)
                     }
                })
            }else{
                const errorTranslations ={
                    internalError: "cant query out the request now",
                    invalidUsername: "Username is wrong or doesn't exist.",
                }
                const errorMessages = error.map(e => errorTranslations[e])
                if (errorMessages == "internalError") {
                    response.status(500).json(errorMessages)
            }else{
                response.status(400).json(errorMessages)
             }
           }
        })
    })
    router.get('/:id', function(request,response){
        const requestHeader = request.header("Authorization")
        const signedInUser = getUserIfSignedIn(requestHeader)
        accountManager.getAccountByUsername(signedInUser,function(errors,account){
            if(errors.length ==0){
                response.status(200).json(account)
            }else{
                if (errors == "internalError") {
                    response.status(500).json(errors)
            }
            if(errors == "YouNeedToLogIn"){
                response.status(401).json('Are you sure that you are signed in ?')
            } else {
            response.status(403).json(errors)
         }
      }
    })
 })
    return router
}