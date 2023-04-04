const dramaValidator = require('./drama-validator')
const authorizeAccount = require('./account-auth')

module.exports = function({dramaRepository, dramaRecensionRepository}){

    const exports = {}

    exports.accountAuth = function(authorization, callback){
        const authErrors = authorizeAccount.accountAuth(authorization)
        callback(authErrors)

    }

    exports.getAllDramas = function(callback){
        dramaRepository.getAllDramas(callback)
    }

    exports.createDrama= function(authorization,drama, callback){
        if(authorization && authorization.isLoggedIn){
            const validationErr = dramaValidator.getErrorsForDrama(drama)
                if(0 < validationErr.length){
                callback(validationErr, null)
            }else{
                dramaRepository.createDrama(drama, function(errors, id){
                    if(errors.length == 0){
                        callback([], id)
                    }else{
                        callback(errors, null)
                    }
                })
            }
        }else{
            callback(['YouNeedToLogIn'], null)
        }
    
    }

    exports.getDramaById = function ( authorization, id, callback){
        if(authorization && authorization.isLoggedIn){
            dramaRepository.getDramaById(id, function(dramaError, drama){
                if(dramaError.length > 0){
                    callback(dramaError, null)
                }else{
                    dramaRecensionRepository.getDramaByDramaRecensions(id, function(recensionError, dramaRecension){
                        if(recensionError.length>0){
                            const data = {
                                drama:null,
                                dramaRecension:null
                            }
                            console.log("line 50 drama-manager"+ dramaRecension );
                            callback(recensionError, data)
                        }else{
                            const data = {
                                drama:drama,
                                dramaRecensions: dramaRecension
                            }
                            callback([], data)
                        }
                    })
                }
            })
        }else{
            callback(['YouNeedToLogIn'], null)
        }
        
    }
    exports.deleteDramaById = function(authorization, dramaID,callback){
        if(authorization && authorization.isLoggedIn){
            dramaRepository.getDramaById(dramaID, function(dramaError, ForDrama){
                if(dramaError.length > 0){
                    callback(dramaError, null)
                }else{
                    if(authorization.userID == ForDrama.accountID){
                        dramaRepository.deleteDramaById(dramaID,callback)
                    }else{
                        callback(["cannotDeleteOthersDrama"], null)
                    }
                }
            })
        }else{
            callback(['YouNeedToLogIn'], null)
        }
    }
    exports.updateDrama= function(authorization, drama, callback){
        if(authorization && authorization.isLoggedIn){
            const errors = dramaValidator.getErrorsForDrama(drama)
            if(0 < errors.length){
            callback(errors, null)
            }else{
                dramaRepository.getDramaById(drama.dramaID, function(dramaError, ForDrama){
                    if(dramaError.length < 0){
                        callback(dramaError,null)
                    }else{
                        if(authorization.userID == ForDrama.accountID){
                            drama.accountID = ForDrama.accountID
                            dramaRepository.updateDrama(drama, callback)
                        }else{
                            callback(["cannotUpdateOthersDrama"], null)
                        }
                    }
                })
            }
        }else{
            callback(['YouNeedToLogIn'], null)
        }
    }

    return exports
    }