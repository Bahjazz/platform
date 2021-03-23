const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 10
const MIN_PASSWORD_LENGHTH = 0

exports.getErrorsNewAccount = function(account){
    const errors = []
    //validate username.
  
if(!account.hasOwnProperty("username")){
    errors.push("usernameMissing")
}if(account.username.length < MIN_USERNAME_LENGTH){
    errors.push("usernameTooShort")
}if(MAX_USERNAME_LENGTH< account.username.length){
    errors.push("usernameTooLong")
} if (MIN_PASSWORD_LENGHTH == account.password.length){
    errors.push("passwordTooShort")
}

return errors
}

