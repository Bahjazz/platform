const MIN_RECENSION_TITLE_LENGTH = 3


exports.getErrorsForRecension = function (dramaRecension) {
    const errors = []

    if(!dramaRecension.hasOwnProperty("name")){
        errors.push("Name is missing")
    }
    else if (dramaRecension.name.length < MIN_RECENSION_TITLE_LENGTH) {
        errors.push("Name must be at least " + MIN_RECENSION_TITLE_LENGTH + "characters.")
    }else if (dramaRecension.description.length < MIN_RECENSION_TITLE_LENGTH) {
        errors.push("description must be at least " + MIN_RECENSION_TITLE_LENGTH + "characters.")
    }
    return errors
}