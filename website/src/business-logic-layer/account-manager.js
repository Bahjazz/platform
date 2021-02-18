const accountValidator = require('./account-validator')

module.exports = function({accountRepository}){

	const exports = {}
	
	exports.getAllAccounts = function(callback){
		accountRepository.getAllAccounts(callback)
	}

	exports.createAccount = function(account, callback){
		// Validate the account.
		const errors = accountValidator.getErrorsNewAccount(account)
		
		if(0 < errors.length){
			callback(errors, null)
			return
		}
		accountRepository.createAccount(account, callback)
		
	}

	exports.getAccountByUsername = function(username, callback){
		accountRepository.getAccountByUsername(username, callback)
	}
	
	return exports

}