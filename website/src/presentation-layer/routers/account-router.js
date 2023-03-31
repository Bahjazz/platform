const express = require('express')
const req = require('express/lib/request')
const USERNAME_MAX_LENGTH = 20
const USERNAME_MIN_LENGTH = 2
const PASSWORD_MIN_LENGTH = 4

module.exports = function ({ accountManager }) {
    const router = express.Router()

    function getActiverUSer(session){
        const activeUser = {
            userID: session.userID,
            isLoggedIn: session.isLoggedIn,
            username:session.username
        }
        return activeUser
    }

    router.get("/accounts-sign-up", function (request, response) {
        response.render('accounts-sign-up.hbs')
    })

    router.post("/accounts-sign-up", function (request, response) {
        const account = {
            username: request.body.username,
            password: request.body.password
        }
        accountManager.createAccount(account, function (errors, id) {
            if (errors.length == 0) {
                response.redirect("/accounts/login")
            } else {
                const errorTranslations = {
                    usernameTooShort: "This username need to be at least "+ USERNAME_MIN_LENGTH + " characters.",
                    usernameTooLong: "This username is too long",
                    internalError: "Cant query out the request now",
                    usernameTaken: "Username already in use.",
                    passwordTooShort: "Password can't be empty ",
                    usernameTaken: "Username already in use.",
                }
                const errorMessages = errors.map(e => errorTranslations[e])
                const model = {
                    errors: errorMessages,
                    username: account.username,
                    password: account.password
                }
                response.render("accounts-sign-up.hbs", model)
            }
        })

    })

    router.get("/login", function (request, response) {
        const model = {
            layout:false
        }
        response.render('login.hbs', model)
    })

    router.post("/login", function (request, response) {
        const enteredUsername = request.body.username
        const enteredPassword = request.body.password
        const data = {
            username: enteredUsername,
            password: enteredPassword,
            isLoggedIn: false
        }
        accountManager.logIn(data, function (errors, user) {
           if(errors.length > 0){
            console.log("Line 69, account-router.js. error = ", errors)
            const errorTranslations = {
                internalError: "cant carry out the reqest now",
                invalidUsername:"username does not exist  wrong",
                usernameMissing: "Username can not be empty",
                invalidPassword: "password does not exist wrong",
                usernameTooShort: "username is too short, must be at least " + USERNAME_MIN_LENGTH + " characters ",
                usernameTooLong: "username too long , must be max " + USERNAME_MAX_LENGTH + " characters",
                passwordTooShort: "password must be at least " + PASSWORD_MIN_LENGTH + " characters",
                Error: 'Error in password , try again'
            } 
            const errorMessages = errors.map(e => errorTranslations[e])
            const model = {
                errors:errorMessages,
                layout: false
            }
            response.render('login.hbs', model)
           }
           else{
               request.session.username = user.username
               request.session.isLoggedIn = user.isLoggedIn
               request.session.userID = user.userID
               response.redirect("/home")
           }
        })
    })

    router.post("/logout", function (request, response) {
        console.log('yrssss is not working line 97 account router');
        request.session.isLoggedIn = false
        request.session.username = null
        request.session.userID = null
        response.redirect("/home")

    })

    router.get("/", function (request, response) {
       const activeUser = getActiverUSer(request.session)
       accountManager.getAllAccounts(activeUser, function(errors, accounts){
           if(0 < errors.length){
            const errorTranslations = {
                YouNeedToLogIn: "You need to log  in to open"
            }
            const errorMessages = errors.map(e => errorTranslations[e])
            const model = {
                errors:errorMessages,
                layout: false
            }
            response.redirect("/accounts/login")
           }else{
            const model = {
                accounts: accounts
            }
            response.render("accounts-list-all.hbs", model)
           }

        })    
    })


    router.get('/:username', function (request, response) {
        const activeUser = getActiverUSer(request.session)
        accountManager.getAccountByUsername(activeUser, function (errors, account) {
          if(errors.length == 0){
              const model = {
                account: account
            }
            response.render("accounts-show-one.hbs", model)
          }else{
            const errorTranslations = {
                YouNeedToLogIn: "You need to log  in to open"
            }
            const errorMessages = errors.map(e => errorTranslations[e])
            const model = {
                errors:errorMessages,
                layout: false
            }
            response.redirect("/accounts/login")
          }
              
        })
    })

    return router
}