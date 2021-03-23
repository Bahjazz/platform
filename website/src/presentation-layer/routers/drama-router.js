const express = require('express')
module.exports = function ({ dramaManager }) {
    const router = express.Router()

    router.get("/drama-create", function (request, response) {
        response.render('drama-create.hbs')
    })

    router.post("/drama-create", function (request, response) {
        const drama = {
            name: request.body.name,
            description: request.body.description
        }
        console.log(drama)
        dramaManager.createDrama(drama, function (errors, id) {
            if (errors.length == 0) {
                response.redirect("/dramas")
            } else {
                const errorTranslations = {
                    nameTooShort: " this name need to be a least 3 characters,",
                    internalError: "cant query out the request now",
                }
                const errorMessages = errors.map(e => errorTranslations[e])

                const model = {
                    errors: errorMessages,
                    name: drama.name,
                    description: drama.description
                }
                response.render("drama-create.hbs", model)
            }

        })
    })

    router.get("/", function (request, response) {
        console.log("called")
        dramaManager.getAllDramas(function (errors, dramas) {
            console.log( "----------------------->"+dramas)
            const model = {
                errors: errors,
                dramas: dramas
            }
            response.render("drama-list-all.hbs",model)
        })
    })

    router.get('/:id', function (request, response) {
        const id = request.params.id
        dramaManager.getDramaById(id, function (errors, drama) {
            const model = {
                errors: errors,
                drama: drama
            }
            response.render("drama-show-one.hbs", model)
        })
    })

    return router
}