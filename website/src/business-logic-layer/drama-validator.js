const MIN_DRAMA_TITLE_LENGTH = 3

exports.getErrorsForDrama = function (drama) {
    const errors = []

    if (!drama.hasOwnProperty('name')) {
        errors.push("Name is missing")
    }else if (drama.name.length < MIN_DRAMA_TITLE_LENGTH) {
        errors.push("Name must be at least " + MIN_DRAMA_TITLE_LENGTH + "characters.")
    }else if (drama.description.length < MIN_DRAMA_TITLE_LENGTH) {
        errors.push("description must be at least" + MIN_DRAMA_TITLE_LENGTH + "characters.")
    }

    return errors
}