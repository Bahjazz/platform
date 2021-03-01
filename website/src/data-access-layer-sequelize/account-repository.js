const { Sequelize, DataTypes, UniqueConstraintError } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')
const Account = sequelize.define('Account', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
		unique: true
  },
  password: {
    type: DataTypes.STRING
  }
}, {
	timestamps: false
})

sequelize.sync({force: true})

module.exports = function(){

	const exports = {}
		
	/*
		Retrieves all accounts ordered by username.
		Possible errors: internalError
		Success value: The fetched accounts in an array.
	*/
	exports.getAllAccounts = function(callback){
		Account.findAll({raw: true})
			.then(accounts => callback([], accounts))
			.catch(e => callback(["internalError"], null))
	}

	/*
		Retrieves the account with the given username.
		Possible errors: internalError
		Success value: The fetched account, or null if no account has that username.
	*/
	exports.getAccountByUsername = function(username, callback){
		Account.findOne({where: {username}, raw: true})
			.then(account => callback([], account))
			.catch(e => callback(["internalError"], null))
	}

	/*
		Creates a new account.
		account: {username: "The username", password: "The password"}
		Possible errors: internalError, usernameTaken
		Success value: The id of the new account.
	*/
	exports.createAccount = function(account, callback){
		
		Account.create(account)
			.then(a => callback([], a.id))
			.catch(e => {
				if(e instanceof UniqueConstraintError){
					callback(['usernameTaken'], null)
				}else{
					callback(['internalError'], null)
				}
			})
		
	}
	
	return exports

}