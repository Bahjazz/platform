const MIN_RECENSION_DISCRIPTION_LENGTH = 3


exports.getErrorsForNewDramaRecensions = function (dramaRecension) {
    const errors = []
    if(dramaRecension.dramaRecensionDescription.length < MIN_RECENSION_DISCRIPTION_LENGTH){
        errors.push("discriptionTooShort")
    }
    return errors
}

exports.LeftRecension = function(userID, dramaRecensions){
    for(let recension of dramaRecensions){
        if(recension.accountID == userID){
            return true
        }
    }
    return false 
}