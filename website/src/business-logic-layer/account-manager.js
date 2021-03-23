const accountValidator = require('./account-validator')
const bcrypt = require("bcrypt")
const saltRounds = 10;

module.exports = function({accountRepository}){

	const exports = {}
	
	exports.getAllAccounts = function(callback){
		accountRepository.getAllAccounts(callback)
	}

	exports.createAccount = async(account, callback) => {
		// Validate the account.
		const errors = accountValidator.getErrorsNewAccount(account)
		
		if(0 < errors.length){
			callback(errors, null)
			return
		}
		account.password = await bcrypt.hash(account.password,saltRounds)
		accountRepository.createAccount(account, callback)
		
	}

	exports.getAccountByUsername = function(username, callback){
		accountRepository.getAccountByUsername(username, callback)
	}
	
	return exports

}