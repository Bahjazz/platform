const accounts = [{
	id: 1,
	username: "Alice",
	password: "abc123"
}]

module.exports = function(){
	
	const exports = {}

	/*
		Retrieves all accounts ordered by username.
		Possible errors: internalError
		Success value: The fetched accounts in an array.
	*/
	exports.getAllAccounts = function(callback){
		callback([], accounts)
	}

	/*
		Retrieves the account with the given username.
		Possible errors: internalError
		Success value: The fetched account, or null if no account has that username.
	*/
	exports.getAccountByUsername = function(username, callback){
		
		const account = accounts.find(a => a.username == username)
		
		callback([], account || null)
		
	}

	/*
		Creates a new account.
		account: {username: "The username", password: "The password"}
		Possible errors: internalError, usernameTaken
		Success value: The id of the new account.
	*/
	exports.createAccount = function(account, callback){
		
		if(accounts.some(a => a.username == account.username)){
			callback(['usernameTaken'], null)
			return
		}
		
		const newAccount = {
			id: accounts.length + 1,
			...account
		}
		
		accounts.push(newAccount)
		
		callback([], newAccount.id)
		
	}
	
	return exports

}