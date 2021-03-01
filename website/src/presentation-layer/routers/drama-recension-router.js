const express = require('express')

module.exports = function ({ dramaRecensionManager }) {

    const router = express.Router()

    router.get("/drama-recension-create", function (request, response) {
        console.log("drama-recension-router.js line 8")

        response.render('drama-recension-create.hbs')
    })

    router.post("/drama-recension-create", function (request, response) {
        console.log("drama-recension-router.js line 14")
        const dramaRecension = {
            name: request.body.name,
            description: request.body.description
        }
        console.log(dramaRecension.description)

        dramaRecensionManager.createDramaRecension(dramaRecension, function (errors, id) {
            console.log(id)

            if (errors.length == 0) {
                response.redirect("/drama-recensions")
            } else {
                const errorTranslations = {
                    nameTooShort: "this name need to be at least 3 characters.",
                    internalError: "cant query out the request now"
                }
                const errormesages = errors.map(e => errorTranslations[e])

                const model = {
                    errors: errormesages,
                    name: dramaRecension.name,
                    description: dramaRecension.description
                }
                response.render("drama-recension-create.hbs", model)

            }
        })

    })

    router.get("/", function (request, response) {
        dramaRecensionManager.getAllDramaRecension(function (errors, dramaRecensions) {
            const model = {
                errors: errors,
                dramaRecensions: dramaRecensions
            }
            response.render("drama-recension-list-all.hbs", model)
        })
    })
    router.get('/:id', function (request, response) {
        const id = request.params.id
        dramaRecensionManager.getDramaRecensionById(id, function (errors, dramaRecension) {

            const model = {
                errors: errors,
                dramaRecension: dramaRecension
            }
            response.render("drama-recension-show-one.hbs", model)
        })

    })

    return router
}