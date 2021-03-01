const { Sequelize, DataTypes, UniqueConstraintError } = require('sequelize')

const sequelize = new Sequelize('sqlite::memory:')
const DramaRecension = sequelize.define('DramaRecension', {
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

    exports.getAllDramaRecension = function (callback) {
        DramaRecension.findAll({ raw: true })
            .then(dramaRecensions => callback([], dramaRecensions))
            .catch(e => callback(["internalError"], null))
    }

    exports.getDramaRecensionById = function (id, callback) {
        DramaRecension.findOne({ where: { id }, raw: true })
            .then(dramaRecension => callback([], dramaRecension))
            .catch(e => callback(["internalError"], null))

    }

    exports.createDramaRecension = function (dramaRecension, callback) {

        DramaRecension.create(dramaRecension)
            .then(a => callback([], a.id))
            .catch(e => {
                if (e instanceof UniqueConstraintError) {
                    callback(['name can´t be empty'], null)
                }else{
                    callback(['internalError'], null)
                }
            })
    }
    return exports

}