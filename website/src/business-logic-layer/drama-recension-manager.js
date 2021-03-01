const dramaRecensionValidator = require('./drama-recension-validator')

module.exports = function ({ dramaRecensionRepository }) {

    const exports = {}

    exports.getAllDramaRecension = function (callback) {
        dramaRecensionRepository.getAllDramaRecension(callback)
    }
    exports.createDramaRecension = function (dramaRecension,  callback) {
        const errors = dramaRecensionValidator.getErrorsForRecension(dramaRecension)

        if (0 < errors.length) {
            callback(errors, null)
            return
        }
        dramaRecensionRepository.createDramaRecension(dramaRecension, callback)
    }

    exports.getDramaRecensionById = function (id, callback) {
        dramaRecensionRepository.getDramaRecensionById(id, callback)
    }
    return exports
}