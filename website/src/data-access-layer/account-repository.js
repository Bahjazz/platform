const db = require ('./db')

module.exports = function(){

    const exports = {}
/*
Retrieves all accounts ordered by username.
possible errors: internalError
Success value: The fetched accounts in an array.
*/
exports.getAllAccounts = function(callback){
 const query = 'SELECT * FROM accounts ORDER BY username'
 const values = []

 db.query(query, values,function(error,accounts){
	 console.log('QUERY:' + accounts)
     if(error){

         callback(['internalError'],null)
     }else{
         callback([],accounts)
     }
 })
}

/*
Retrieves the accounts  with given  username.
possible errors: internalError
Success value: The fetched accounts or null if no account has that username.
*/
exports.getAccountByUsername = function(username, callback){
const  query = "SELECT * FROM accounts WHERE username = ? LIMIT 1"
const values = [username]
db.query(query, values, function(error,accounts){
	console.log(error)
	console.log(accounts)
    if(error){
        callback(['internalError'], null)
    }else{
        callback([],accounts[0])
    }
})
}
/*
Create a new account.
account:{username:"The username",password: "The password"}
possible errors: internalError, usernameTaken
Success value: The id of the new account.
*/
exports.createAccount = function(account,callback){
	const query = `INSERT INTO accounts (username, password) VALUES (?, ?)`
		const values = [account.username, account.password]
		
		db.query(query, values, function(error, results){
			if(error){
				console.log(error.sqlMessage)
				//if(error.sqlMessage.includes("usernameUnique")){
				//	callback(['usernameTaken'], null)
				//}else{
					callback(['internalError'], null)
				//}
			}else{
				console.log(results)
				callback([], results.insertId)
			}
		})
		
	
        

    }
	return exports
}