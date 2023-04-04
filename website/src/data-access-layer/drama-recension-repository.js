const db = require ('./db')

module.exports = function (){

    const exports = {}

   exports.getAllDramaRecension = function(callback){
      const query = 'SELECT accounts.username, dramaRecensions. dramaRecensionID, dramaRecensions.dramaRecensionDescription, dramaRecensions.dramaID, dramaRecensions.accountID FROM  dramaRecensions JOIN accounts ON accounts.accountID =  dramaRecensions.accountID ORDER BY dramaRecensionID'
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
       const query = 'SELECT dramas.dramaName, dramas.dramaDescription, dramaRecensions.dramaRecensionID, dramaRecensions.dramaRecensionDescription, dramaRecensions.dramaID,dramaRecensions.accountID FROM dramaRecensions JOIN dramas ON dramas.dramaID = dramaRecensions.dramaID WHERE dramaRecensionID = ? LIMIT 1'
       const values = [dramaRecensionID]
       db.query(query,values,function(error,dramaRecensions){
        console.log("line 22 drama-recension-repository.js" + dramaRecensions)
           if(error){
               callback(['internalError'], null)
           }else{
               callback([], dramaRecensions[0])
           }
       })
   }

   exports.createDramaRecension = function(dramaRecension, callback){
    console.log("line 32, drecen-repo")
    console.log(dramaRecension)
    const query = `INSERT INTO dramaRecensions (dramaRecensionDescription, dramaID, accountID) VALUES (?,?,?)` 
    const values = [dramaRecension.dramaRecensionDescription, dramaRecension.dramaID, dramaRecension.userID]
    db.query(query, values, function(error,newDramaRecensionData){
        console.log("lie 35, drama-recension-repo.js")
        console.log(error)
        if(error){
             callback(['internalError'], null)
        }else{
           callback([], newDramaRecensionData.insertId)
        }
    })
}

exports.getDramaByDramaRecensions = function(dramaId, callback){
    const query = 'SELECT accounts.username, dramaRecensions.dramaRecensionID, dramaRecensions.dramaRecensionDescription, dramaRecensions.dramaID, dramaRecensions.accountID FROM dramaRecensions JOIN accounts ON accounts.accountID = dramaRecensions.accountID WHERE dramaID = ? ORDER BY dramaRecensionID'
    const values = [dramaId]
    db.query(query,values, function(error, dramaRecensions){
        if(error){
            callback(['internalError'], null)
        }else{
            callback([], dramaRecensions)
            console.log("line 51, drama-recension-repository"+ dramaRecensions)
        }
    })
}

   return exports
}
