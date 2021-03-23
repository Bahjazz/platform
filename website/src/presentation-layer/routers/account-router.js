const express = require('express')
const bcrypt = require('bcrypt')
const USERNAME_LENGTH = 4

module.exports = function ({ accountManager }) {
    const router = express.Router()


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
                response.redirect("/accounts")
            } else {
                const errorTranslations = {
                    usernameTooShort: "this username need to be at least"+ USERNAME_LENGTH + " characters.",
                    usernameTooLong: "this username is too long",
                    internalError: "cant query out the request now",
                    usernameTaken: "Username already in use.",
                    passwordTooShort: "Password is empty try again",

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
        console.log("line 39")
        response.render('login.hbs')
    })
    router.post("/login", function (request, response) {

        console.log("line 44")
        const enteredUsername = request.body.username
        const enteredPassword = request.body.password
        accountManager.getAccountByUsername(enteredUsername, function (error, account) {
            if(error == 0){
                bcrypt.compare(enteredPassword, account.password, function (err, result) {
                    if (result) {
                        request.session.isLoggedIn = true
                        request.session.username = enteredUsername
                        console.log("Userdata correct")
                        response.redirect('/home')
                    } else {
                        console.log("Userdata wrong")
                        request.session.isLoggedIn = false
                        const model = {
                            errors: error,
                            account: account,
                            layout: false
                        }

                        response.render('login.hbs', model)
                    }

                })
             } else{
                const errorTranslations = {
                    internalError: "cant carry out the reqest now",
                    invalidUsername:"username is wrong"
                } 
                console.log("error in acc")
            }
        })
    })
    router.post("/logout", function (request, response) {
        request.session.isLoggedIn = false
        response.redirect("/home")

    })

    router.get("/", function (request, response) {
        if(request.session.isLoggedIn){

        accountManager.getAllAccounts(function (errors, accounts) {
            console.log('ACCOUNTS: ' + accounts)
            const model = {
                errors: errors,
                accounts: accounts
            }
            response.render("accounts-list-all.hbs", model)
        })
        console.log('POST')
    }
    })
    router.get('/:username', function (request, response) {
        if(request.session.isLoggedIn){

        const username = request.params.username
        accountManager.getAccountByUsername(username, function (errors, account) {

            const model = {
                errors: errors,
                account: account
            }
            response.render("accounts-show-one.hbs", model)
        })
    }
    })
    return router
}