const dramaRecensionValidator = require('./drama-recension-validator')

module.exports = function ({ dramaRecensionRepository, dramaRepository }) {

    const exports = {}

    exports.getAllDramaRecensions = function (authorization,callback) {
        if(authorization && authorization.isLoggedIn){
            dramaRecensionRepository.getAllDramaRecensions(function(errors, dramaRecensions){
                if(errors.length > 0){
                     callback(errors, null)
            }
            else{
                callback([], dramaRecensions)
            }
         })
        }   else{
              callback(["YouNeedToLogIn"], null)
       }
    }

    exports.getDramaByDramaRecensions = function(authorization, dramaID, callback){

        if(authorization && authorization.isLoggedIn){
            dramaRecensionRepository.getDramaByDramaRecensions(dramaID, function(dramaRecensionError, dramaRecensions){
                 if(dramaRecensionError.length > 0){
                     callback(dramaRecensionError, null)
                 }else{
                    dramaRepository.getDramaById(dramaID, function(dramaError,drama){
                        if(dramaError.length > 0){
                            callback(dramaError, null)
                        }else{
                            if(dramaRecensionValidator.LeftRecension(authorization.username, dramaRecensions)){
                                callback(["leftsomeRecensionForDrama"], drama)
                            }else{
                                callback([], drama)
                            }
                        }
                    })  
                 }
            })
        }else{
            callback(['YouNeedToLogIn'], null)
        }
    }
    exports.createDramaRecension = function (authorization, dramaRecension,  callback) {
        if(authorization && authorization.isLoggedIn){
             const errors = dramaRecensionValidator.getErrorsForNewDramaRecensions(dramaRecension)
             if(0 < errors.length){
                 callback(errors, null)
             }else{
                dramaRecensionRepository.getDramaByDramaRecensions(dramaRecension.dramaID, function(error, dramaRecensions){
                    if(error.length > 0){
                      callback(error, null)
                    }else{
                        if(dramaRecensionValidator.LeftRecension(authorization.userID, dramaRecensions )){
                            errors.push("leftsomeRecensionForDrama")
                            callback(errors, null)
                        }else{
                            dramaRecensionRepository.createDramaRecension(dramaRecension, callback)
                        }
                    }
                })
             }
        }else{
            callback(['YouNeedToLogIn'], null)
        }
    }

    exports.getDramaRecensionById = function (authorization, id, callback) {
        if(authorization && authorization.isLoggedIn){
             dramaRecensionRepository.getDramaRecensionById(id, function(errors, dramaRecensionData){
                 if(errors.length > 0){
                     callback(errors, null)
                 }
                 else{
                     callback([], dramaRecensionData)
                 }
             })
        }else{
            callback(['YouNeedToLogIn'], null)
        }
       
    }
    return exports
}