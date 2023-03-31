const express = require('express')
module.exports = function ({ dramaManager }) {
    const router = express.Router()

    function getActiverUSer(session){
        const activeUser = {
            userID: session.userID,
            isLoggedIn: session.isLoggedIn,
            username:session.username
        }
        return activeUser
    }
   
    router.get("/drama-create", function (request, response) {
        const activeUser = getActiverUSer(request.session)
        dramaManager.accountAuth(activeUser, function(errors){
            if(errors.length == 0){
            response.render('drama-create.hbs')
            }else{
                response.redirect('/accounts/login')
            }
        })
        
    })

    router.post("/drama-create", function (request, response) {
        const activeUser = getActiverUSer(request.session)
        const drama = {
            dramaName: request.body.name,
            accountID: request.session.userID,
            dramaDescription: request.body.description
            
        }
        console.log(drama)
        dramaManager.createDrama(activeUser, drama, function (errors, id) {
            if (errors.length == 0) {
                response.redirect("/dramas") 
            }else{
                const errorTranslations = {
                    nameTooShort: " this name need to be a least 3 characters,",
                    internalError: "cant query out the request now",
                    NameMissing: "Name can't be empty",
                    descriptionMissing: "Description can't be empty",
                    errorforDrama:  "Try to sign in again"
                } 
                 const errorMessages = errors.map(e => errorTranslations[e])

                const model = {
                    errors: errorMessages,
                    name: drama.dramaName,
                    description: drama.dramaDescription
                }
                response.render("drama-create.hbs", model)
             }
        })
    })

    router.get("/", function (request, response) {
        dramaManager.getAllDramas(function (errors, dramas) {
            console.log( "----------------------->"+dramas)
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
        const activeUser = getActiverUSer(request.session)
        const id = request.params.id
        dramaManager.getDramaById( activeUser,id, function (errors, data) {
            let drama = false
            if(errors.length == 0){
                request.session.drama = {
                    dramaID:id,
                    dramaAccountID: data.accountID
                }
                if(data.drama.accountID == request.session.userID)
                {
                        drama = true
                } 

                }else{
                    const errorTranslations = {
                        nameTooShort: " this name need to be a least 3 characters,",
                        internalError: "cant query out the request now",
                        NameMissing: "Name can't be empty",
                        descriptionMissing: "Description can't be empty",
                }
                const errorMessages = errors.map(e => errorTranslations[e])
                const model = {
                errors: errors,
                mydrama: drama

                }
                response.render("drama-show-one.hbs", model)

          }
          
      })
    })

    return router
}