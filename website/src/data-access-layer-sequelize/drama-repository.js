const { Sequelize, DataTypes, UniqueConstraintError } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')
const Drama = sequelize.define('Drama', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    }

}, {
    timestamps: false
})
sequelize.sync({ force: true })

module.exports = function () {
    const exports = {}

    exports.getAllDramas = function (callback) {
        Drama.findAll({ raw: true })
            .then(dramas => callback([], dramas))
            .catch(e => callback(["internalError"], null))
    }

    exports.getDramaById = function (id, callback) {
        Drama.findOne({ where: {dramaID: id }, raw: true })
            .then(drama => callback([], drama))
            .catch(e => callback(["internalError"], null))
    }
    exports.createDrama = function (drama, callback) {
        Drama.create(drama)
            .then(drama => callback([], drama.id))
            .catch(e => callback(["internalError"], null))
         
    }
    exports.deleteDramaById = function (drama, callback) {
        Drama.destroy({ where: { id: drama.dramaID }
            .then(drama => callback([], null))
            .catch(e => callback(["internalError"], null))
        })
 }

    exports.updateDrama = function (drama, callback) {
        Drama.update({
            name: drama.name,
            description: drama.description
        }, {
            where: { id: drama.dramaID }
        }).then(callback([]))
        .catch(e => callback(["internalError"]))
    }

    return exports

}