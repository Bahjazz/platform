const dramaValidator = require('./drama-validator')

module.exports = function({dramaRepository}){

const exports = {}

exports.getAllDramas = function(callback){
    dramaRepository.getAllDramas(callback)
}

exports.createDrama= function(drama, callback){
    
    const errors = dramaValidator.getErrorsForDrama(drama)
    if(0 < errors.length){
        callback(errors, null)
        return
    }
    dramaRepository.createDrama(drama, callback)
}

exports.getDramaById = function (id, callback){
    dramaRepository.getDramaById(id, callback)
}

return exports
}