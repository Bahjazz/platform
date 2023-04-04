const express = require('express')
const dramaRecensionRouter = require('./drama-recension-router')
module.exports = function ({ dramaManager }) {
    const router = express.Router()

    function getActiveUser(session){
        const activeUser = {
            userID: session.userID,
            isLoggedIn: session.isLoggedIn,
            username:session.username
        }
        return activeUser
    }
   
    router.get("/drama-create", function (request, response) {
        const activeUser = getActiveUser(request.session)
        dramaManager.accountAuth(activeUser, function(error){
            if(error.length == 0){
                 response.render('drama-create.hbs')
            }else{
                response.redirect('/accounts/login')
            }
        })
        
    })

    router.post("/drama-create", function (request, response) {
        const activeUser = getActiveUser(request.session)
        const drama = {
            dramaName: request.body.name,
            accountID: request.session.userID,
            dramaDescription: request.body.description 
        }
        dramaManager.createDrama(activeUser, drama, function (error, id) {
            if (error.length == 0) {
                response.redirect("/dramas") 
            }else{
                if(error.indexOf("YouNeedToLogIn") > -1){
                    response.redirect('/accounts/login')
                 } else{ 
                const errorTranslations = {
                    nameTooShort: " this name need to be a least 3 characters,",
                    internalError: "cant query out the request now",
                    NameMissing: "Name can't be empty",
                    descriptionMissing: "Description can't be empty",
                    errorforDrama:  "Try to sign in again"
                } 
                 const errorMessages = error.map(e => errorTranslations[e])
                 const model = {
                    err: errorMessages,
                    dramaName: drama.dramaName,
                    dramaDescription: drama.dramaDescription
                }
                response.render("drama-create.hbs", model)
              }
            } 
        })
 }) 

    router.get("/", function (request, response) {
        dramaManager.getAllDramas(function (errors, dramas) {
            if(dramas !=null){
                const model = {
                errors: errors,
                dramas: dramas
             }
             response.render("drama-list-all.hbs",model)
            }else{
                const model = {
                    dramas:null
             }
             response.render("drama-list-all.hbs",model)
            }
            
        })
    })

    router.get('/:id', function (request, response) {
        const activeUser = getActiveUser(request.session)
        const id = request.params.id
        dramaManager.getDramaById( activeUser,id, function (errors, data) {
            let isDrama = false
            if(errors.length == 0){
                request.session.drama = {
                    dramaAccountID: id,
                    dramaID: data.drama.dramaID
                }
                   const model = {
                        isDrama: true,
                        drama: data.drama,
                        dramaRecensions: data.dramaRecensions
                    }
                    
                    response.render("drama-show-one.hbs", model)   
            }else{
                if(errors.indexOf("YouNeedToLogIn") > -1){
                    response.redirect('/accounts/login')
                 } else{
                const errorTranslations = {
                    nameTooShort: " this name need to be a least 3 characters,",
                    internalError: "cant query out the request now",
                    NameMissing: "Name can't be empty",
                    descriptionMissing: "Description can't be empty",
                }
                const errorMessages = errors.map(e => errorTranslations[e])
                const model = {
                errors: errors,

                }
              
          }
        }
          
      })
    })

    return router
}