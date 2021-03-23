const express = require('express')
app.use(function (request, response, next) {

    console.log(request.method, request.url)

    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "*")
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Expose-Headers", "*")

    next()
})
module.exports = function ({ dramaManager }) {
    const router = express.Router()

    

    router.post("/api/drama-create", function (request, response) {
        const drama = {
            name: request.body.name,
            description: request.body.description
        }
        dramaManager.createDrama(drama, function (errors, id) {
            if (errors.length == 0) {
                response.status(201).json(drama)
            } else {
                const errorTranslations = {
                    nameTooShort: " this name need to be a least 3 characters,",
                    internalError: "cant query out the request now",
                    namnIsEmpty: "name can not be empty",
                    descriptionIsEmpty: "Description can not be empty"
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

    router.get("/", function (request, response) {
        dramaManager.getAllDramas(function (errors, dramas) {
            if (errors.length > 0) {
                response.status(500).json(errors)
            } else {
                response.status(200).json(drama)
            }
        })
    })
       

    router.put('/:id', function (request, response) {
        const id  = request.params.id
        const drama = {
            newName: request.body.name,
            newDescription: request.body,
            dramaId:id

        }
        dramaManager.updateDrama(drama, function (errors) {
            if (!drama) {
                response.status(404).end()
            } else {
                if(errors.length == 0){
                   response.status(204).end()
                }else{
                response.status(404).json(errors)
                }
            }
        })

    })

    router.delete("/:id", function (request, response) {
        dramaManager.deleteDrama(id, function (errors) {
            if (errors.length == 0) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
    })

    return router
}