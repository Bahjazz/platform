const dramaValidator = require('./drama-validator')
const authorizeAccount = require('./account-auth')

module.exports = function({dramaRepository, dramaRecensionRepository}){

const exports = {}

exports.getAllDramas = function(callback){
    dramaRepository.getAllDramas(callback)
}
exports.accountAuth = function(authorization, callback){
    const authErrors = authorizeAccount.accountAuth(authorization)
    callback(authErrors)

}
exports.createDrama= function(authorization,drama, callback){
    if(authorization && authorization.isLoggedIn){
         const errors = dramaValidator.getErrorsForDrama(drama)
            if(0 < errors.length){
               callback(errors, null)
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
         dramaRepository.getDramaById(id, function(error, drama){
             if(error.length > 0){
                 callback(error, null)
             }else{
                dramaRecensionRepository.getDramaByDramaRecensions(id,function(recensionError, recension){
                    if(recensionError.length>0){
                        const result = {
                            drama:null,
                            recension:null
                        }
                        callback(recensionError, data)
                    }else{
                        const data = {
                            drama:drama,
                            dramaRecensions: recension
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
        dramaRepository.getDramaById(dramaID, function(error, dramas){
            if(error.length > 0){
                callback(error, null)
            }else{
                if(authorization.userID==dramas.accountID){
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
            dramaRepository.getDramaById(drama.dramaID, function(error, dramas){
                if(error.length < 0){
                    callback(error,null)
                }else{
                    if(authorization.userID == dramas.accountID){
                        drama.accountID = dramas.accountID
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