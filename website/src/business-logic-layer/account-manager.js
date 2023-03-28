const accountValidator = require('./account-validator')
const bcrypt = require("bcrypt")

module.exports = function({accountRepository}){

	const exports = {}
	exports.logIn = function(LoginData, callback){
		const errors = accountValidator.getErrorsForLogIn(LoginData)
		if(0<errors.length){
			callback(errors, null)
		}else{
			accountRepository.getAccountByUsername(LoginData.username, function(error, account){
				if(account != null){
					bcrypt.compare(LoginData.password, account.password, function(bcryptError,isRightPassword){
						if(isRightPassword){
							const userIdentity = {
								username:account.username,
								userID: account.accountID,
								isLoggedIn: true
							}
							callback([], userIdentity)
						}
						else if(bcryptError){
							LoginData = {
								username: LoginData.username,
								isLoggedIn: false
							}
							errors.push('Error')
							callback(errors, LoginData)
						}
						else{
							LoginData = {
								username: LoginData.username,
								isLoggedIn:false
							}
							errors.push('invalidPassword')
							callback(errors, LoginData)
						}
					})
				}else{
					LoginData = {
					   username: LoginData.username,
					   isLoggedIn: false
					}
					callback(error, LoginData)
				}
			})
		}
	}


	exports.getAllAccounts = function(authorization,callback){
		if(authorization && authorization.isLoggedIn){
			accountRepository.getAllAccounts(callback)
		}else{
			callback(['YouNeedToLogIn'])
		}
	}

	exports.createAccount = function(account, callback){
		const errors = accountValidator.getErrorsNewAccount(account)
		if(0 < errors.length){
			callback(errors, null)
		}else{
			const saltRounds = 10
			bcrypt.hash(account.password,saltRounds, function(error, hash){
				if(error){
				  callback(error, null)
				}else{
					account.password = hash
					accountRepository.createAccount(account, callback)
				}
				  
			})
		}		
	}

	exports.deleteAccountById = function(authorization, callback){
		if(authorization && authorization.isLoggedIn){
			accountRepository.deleteAccountById(authorization.userID, callback)
		}else{
			callback(['YouNeedToLogIn'])		
		}

	}

	exports.getAccountByUsername = function(authorization, callback){
		if(authorization && authorization.isLoggedIn){
			accountRepository.getAccountByUsername(authorization.username, callback)
		}else{
			callback(['YouNeedToLogIn'])
		}
	}

	exports.updateAccount = function(authorization, account, callback){
		const errors = accountValidator.getUpdateForAccountErrors(account)
		if(authorization && authorization.isLoggedIn){
			if(0 < errors.length){
				callback(errors, null)
			}else{
				accountRepository.updateAccount(account, callback)
			}

		}
        else{
			callback(['YouNeedToLogIn'])		
		}     
	}

	
	return exports

}