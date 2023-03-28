const { deserializeStream } = require('bson')
const { Sequelize, DataTypes, UniqueConstraintError } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const Account = sequelize.define('Account', {
  username: {
      type: Sequelize.TEXT,
      allowNull: false,
	  unique: true
  },
   password: Sequelize.TEXT
}, {
	timestamps: false
})

sequelize.sync({force: true})

module.exports = function(){

	const exports = {}
	
	exports.getAllAccounts = function(callback){
		Account.findAll({raw: true})
			.then(accounts => callback([], accounts))
			.catch(e => callback(["internalError"], null))
	}

	exports.getAccountByUsername = function(username, callback){
		Account.findOne({where: {username}, raw: true})
			.then(account => callback([], account))
			.catch(e => callback(["internalError"], null))
	}
	exports.createAccount = function(account, callback){
		
		Account.create(account)
			.then(account => callback([], account.id))
			.catch(e => {
				if(e instanceof UniqueConstraintError){
					callback(['usernameTaken'], null)
				}else{
					callback(["internalError"], null)
				}
			})
		
	}
	exports.deleteAccountById = function (id, callback){
		Drama.destroy({
			where:{accountID: id}
			.then()
			.catch(e => callback(["internalError"]))
		})
	}
	exports.updateAccount = function(account, callback){
		Account.update({
			username:account.username
		},{
			where:{id: account.accountID}
		}).then(callback([]))
		.catch(e => callback(["internalError"]))
	}
	return exports

}