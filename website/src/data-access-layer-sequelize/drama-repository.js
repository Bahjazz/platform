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
        Drama.findOne({ where: { id }, raw: true })
            .then(drama => callback([], drama))
            .catch(e => callback(["internalError"], null))
    }
    exports.createDrama = function (drama, callback) {
        Drama.create(drama)
            .then(a => callback([], a.id))
            .catch(e => {
                if (e instanceof UniqueConstraintError) {
                    callback(["name cant be empty"], null)
                } else {
                    callback(["internalError"], null)
                }
            })
    }
    exports.updateDrama = function (account, callback) {
        Account.update({
            username: account.username
        }, {
            where: { username: account.username }
        }).then(callback([]))
            .catch(e => callback(["internalError"]))
    }
    exports.deleteTrip = function (account, callback) {
        Account.destroy({ where: { username: account.username }
            .then()
            .catch(e => callback(['internalError']
            ))
    })

    }

    return exports

}