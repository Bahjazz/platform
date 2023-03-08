const db = require ('./db')

module.exports = function (){

    const exports = {}

   exports.getAllDramaRecension = function(callback){
      const query = 'SELECT accounts.username, dramaRecensions. dramaRecensionID, dramaRecensions.dramaRecensionDescription, dramaRecensions.dramaID, dramaRecensions.accountID FROM  dramaRecensions JOIN accounts ON accounts.accountsID =  dramaRecensions.accountID ORDER BY dramaRecensionID'
      const values = []
       db.query(query,values,function(error,dramaRecensions){
           if(error){
            callback(['internalError'], null)
           }else{
              callback([], dramaRecensions)
           }
       })
   }
   exports.getDramaRecensionById = function(dramaRecensionID, callback){
       const query = 'SELECT drama.dramaName, drama.dramaDescription, dramaRecensions.dramaRecensionID, dramaRecensions.dramaRecensionDescription, dramaRecensions.dramaID,dramaRecensions.accountID FROM dramaRecensions JOIN dramas ON dramas.dramaID = dramaRecensions.dramaID WHERE dramaRecensionID = ? LIMIT 1'
       const values = [dramaRecensionID]
       db.query(query,values,function(error,dramaRecensions){
           if(error){
               callback(['internalError'], null)
           }else{
               callback([],dramaRecensions[0])
           }
       })
   }

   exports.createDramaRecension = function(dramaRecension,callback){
    const query = `INSERT INTO dramaRecensions (dramaRecensionDescription,dramaID,accountID) VALUES (?,?,?)` 
    const values = [dramaRecension.dramaRecensionDescription,, dramaRecension.dramaID, dramaRecension.userID]
    db.query(query, values, function(error,results){
        if(error){
             callback(['internalError'], null)
        }else{
           callback([], results.insertId)
        }
    })
}

exports.getDramaByDramaRecensions = function(dramaId, callback){
    const query = 'SELECT accounts.username,dramaRecensions.dramaRecensionID,dramaRecensions.dramaRecensionDescription,dramaRecensions.dramaID, dramaRecensions.accountID FROM dramaRecensions JOIN accounts ON accounts.accountID = dramaRecensions.accountID WHERE dramaID = ? ORDER BY dramaRecensionID'
    const values = [dramaId]
    db.query(query,values, function(error, dramaRecensions){
        if(error){
            callback(['internalError'], null)
        }else{
            callback([],dramaRecensions)
        }
    })
}

   return exports
}
