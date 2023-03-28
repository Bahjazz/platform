const { Sequelize, DataTypes, UniqueConstraintError } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const DramaRecension = sequelize.define('DramaRecension', {
    description: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
})

sequelize.sync({ force: true })

module.exports = function () {

    const exports = {}

    exports.getAllDramaRecension = function (callback) {
        DramaRecension.findAll({ raw: true })
            .then(dramaRecensions => callback([], dramaRecensions))
            .catch(e => callback(["internalError"], null))
    }

    exports.getDramaRecensionById = function (id, callback) {
        DramaRecension.findOne({ where: {id: id }, raw: true })
            .then(dramaRecension => callback([], dramaRecension))
            .catch(e => callback(["internalError"], null))
    }

    exports.createDramaRecension = function (dramaRecension, callback) {
        DramaRecension.create(dramaRecension)
            .then(adramaRecension => callback([], adramaRecension.id))
            .catch(e => callback(["internalError"], null))

         }
    exports.getDramaByDramaRecensions = function(dramaId, callback){
        DramaRecension.findAll({raw: true, Where: {dramaID: dramaId}})
            .then(dramaRecensions => callback([], dramaRecensions))
            .catch(e => callback(["internalError"], null))
    }
    return exports

}