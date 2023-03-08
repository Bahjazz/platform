exports.accountAuth = function(authorization){
    const errors = []
    if(!authorization.isLoggedIn){
        errors.push("YouNeedToLogIn")
    }

    return errors
}