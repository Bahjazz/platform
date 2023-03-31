const MIN_NAME_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 3
exports.getErrorsForDrama = function (drama) {
    const errors = []

    if (drama.dramaName.length == MIN_NAME_LENGTH) {
        errors.push("nameMissing")
    }
    if(drama.dramaDescription.length == MIN_DESCRIPTION_LENGTH ){
        errors.push =["descriptioMissing"]
    }
    

    return errors
}