const express = require('express')

module.exports = function({accountManager}){
const router = express.Router()


router.get("/accounts-sign-up", function(request,response){
    response.render('accounts-sign-up.hbs')
})
/*
router.get("/sign-up", function(request,response){
    response.render('accounts.hbs')
})
*/
router.post("/accounts-sign-up", function(request,response){
    const account = {
        username: request.body.username,
        password: request.body.password
    }
    accountManager.createAccount(account,function(errors, id){
        if(errors.length == 0){
            response.redirect("/accounts")
        }else{
            const errorTranslations = {
                usernameTooShort: "this username need to be at least 3 characters.",
                usernameTooLong: "this username is too long",
                internalError: "cant query out the request now",
                usernameTaken: "Username already in use."
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
router.get("/sign-in",function(request, response){
    response.render("accounts-sign-in.hbs")
})
router.get("/",function(request,response){
    console.log('CALLED')
    accountManager.getAllAccounts(function(errors,accounts){
        console.log('ACCOUNTS: ' + accounts)
    const model = {
        errors: errors,
        accounts: accounts
    }
    response.render("accounts-list-all.hbs", model)
  })
  console.log('POST')
})
router.get('/:username',function(request,response){
    const username = request.params.username
    accountManager.getAccountByUsername(username,function(errors,account){

      const model = {
      errors: errors,
      account: account
    }
    response.render("accounts-show-one.hbs", model)
 })
   
})
return router
}