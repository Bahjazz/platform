const express = require('express')

module.exports = function ({ dramaRecensionManager }) {

    const router = express.Router()

    function getActiveUser(session){
        const activeUser = {
            userID: session.userID,
            isLoggedIn: session.isLoggedIn,
            username: session.username
        }
        return activeUser
    }

    router.get("/create", function (request, response) {
        const activeUser = getActiveUser(request.session)
        const dramaId = request.session.drama.dramaID 
        dramaRecensionManager.getDramaByDramaRecensions(activeUser, dramaId, function(errors, data ){
            if(errors.length == 0){
              response.render('drama-recension-create.hbs')
            }else{
                    const errorTranslations = {
                    internalError: "Cant carry out the request now!",
                    discriptionTooShort: "Description must be more than 3 characters",
                    leftsomeRecensionForDrama: "You have made a reecension on this drama"
                    } 
                    const errorMesages = errors.map(e => errorTranslations[e])
                    const model = {
                        error: errorMesages,
                        drama: data.drama,
                        dramaRecensions: data.dramaRecension
                    }
                    response.render("drama-show-one.hbs", model)
                }
        })
      
    })

    router.post("/create", function (request, response) {
        const activeUser = getActiveUser(request.session)
        const dramaRecension = {
            dramaRecensionDescription: request.body.description,
            dramaID:request.session.drama.dramaID,
            userID: request.session.userID,
            dramaAccountID: request.session.drama.dramaAccountID
        }
        console.log("line 53", dramaRecension.description)
        dramaRecensionManager.createDramaRecension(activeUser, dramaRecension, function (errors, id) {
            if (errors.length == 0) {
                response.redirect("/dramas/" + dramaRecension.dramaID)
            } else {
                    const errorTranslations = {
                        internalError: "Cant carry out the request now!",
                        discriptionTooShort: "Description must be more than 3 characters",
                        leftsomeRecensionForDrama: "You have made a reecension on this drama"
                    } 
                    const errorMessages = errors.map(e => errorTranslations[e])
                    const model = {
                    error: errorMessages,
                    dramaRecensionDescription: dramaRecension.dramaRecensionDescription
                }
                response.render("drama-recension-create.hbs", model)
              }
            
        })

    })

    router.get('/:id', function (request, response) {
        const activeUser = getActiveUser(request.session)
        const id = request.params.id
        dramaRecensionManager.getDramaRecensionById(activeUser, id, function(errors, dramaRecension) {
            if(errors.length == 0){
               const model = {
                    dramaRecension: dramaRecension
            }
             response.render("drama-recension-show-one.hbs", model)
            }else {
                    const model = {
                        error: errors,
                        dramaRecension:dramaRecension
                 }
                 response.render("drama-recension-show-one.hbs", model)

              }
            
        })
    })
   

    return router
}