const express = require('express')
const USERNAME_LENGTH = 4
app.use(function (request, response, next) {

    console.log(request.method, request.url)

    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "*")
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Expose-Headers", "*")

    next()
})
module.exports = function ({ accountManager }) {
    const router = express.Router()
    const ACCESS_TOKEN_SECRET = "babbababbsdvv"

    router.get("/", function (request, response) {
        accountManager.getAllAccounts(function (errors, accounts) {
            if (errors.length > 0) {
                response.status(500).json(errors)
            } else {
                response.status(200).json(accounts)
            }
        })
    })

    router.post("/api/accounts-sign-up", function (request, response) {
        console.log('pre');
        const account = {
            username: request.body.username,
            password: request.body.password

        }
        const authorizationHeader = request.header("Authorization")
        const accessToken = authorizationHeader.substring("Bearer ".length)
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, function (error, payload) {
            console.log('jwt');
            accountManager.createAccount(account, function (errors, id) {
                if (errors.length == 0) {
                    response.setHeader("Location", "/account/" + id)
                    response.status(201).json(account)
                } else {
                    const errorTranslations = {
                        usernameTooShort: "this username need to be at least" + USERNAME_LENGTH + "characters.",
                        usernameTooLong: "this username is too long",
                        internalError: "cant query out the request now",
                        usernameTaken: "Username already in use."
                    }
                    const errorMessages = errors.map(e => errorTranslations[e])
                    if (errors == "internalError") {
                        response.status(500).end()
                    } else {
                        response.status(400).json(errorMessages)
                    }
                }
            })
        })
    })

    router.post("/login", function (request, response) {

        const enteredUsername = request.body.username
        const enteredPassword = request.body.password
        accountManager.getAccountByUsername(enteredUsername, function (error, account) {
            if (error.length == 0) {
                response.status(200).json(account)
            } else {
                const errorTranslations = {
                    internalError: "cant carry out the reqest now",
                    invalidUsername: "username is wrong"
                }
                const errorMessages = errors.map(e => errorTranslations[e])
                if (errors == "internalError") {
                    response.status(500).end()
                } else {
                    response.status(400).json(errorMessages)
                }
            }


        })
    })

    router.get('/:username', function (request, response) {
        const username = request.params.username
        accountManager.getAccountByUsername(username, function (errors, account) {
            if (account) {
                response.status(200).json(account)
            } else {
                response.status(404).end()
            }
        })

    })
    return router
}