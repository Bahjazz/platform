const db = require('./db')
module.exports = function(){

const exports = {}

exports.getAllDramas = function(callback){
    const query = 'SELECT * FROM dramas ORDER BY DramaID'
    const values = []
    db.query(query, values, function(error, dramas){
        console.log(dramas)
        if(error){
            callback(['internalError'], null)
        }else{
            callback([], dramas)
        }
    })
}


exports.getDramaById = function(id, callback){
    const query = 'SELECT accounts.username, dramas.dramaID, dramas.dramaName, dramas.dramaDescription, dramas.accountID FROM dramas JOIN accounts ON accounts.accountID = dramas.accountID WHERE dramaID = ? LIMIT 1'
    const values = [id]
    db.query(query, values, function(error, dramas){
        if(error){
            callback(['internalError'], null)
        }else{
            callback([], dramas[0])
        }
    })
}


exports.createDrama = function(drama, callback){
    const query = ' INSERT INTO dramas(dramaName, dramaDescription,accountID) VALUES(?,?,?)'
    const values = [drama.dramaName, drama.dramaDescription, drama.accountID]
    db.query(query, values, function(error, results){
        if(error){
            console.log(error.sqlMessage)
                 callback(['internalError', null])
        }else{
            console.log(results)
            callback([], results.insertId)
        }
    })
}

exports.updateDrama = function(account, callback){
   const query = `updata drama SET dramaName =? , dramaDescription =? WHERE dramaID = ?`
   const values = [drama.dramaName, drama.dramaDescription, drama.dramaID]
   db.query(query, values, function(error, newUpdate){
       if(error){
           callback(['internalError'])
       }else{
        callback([],newUpdate )
       }

   })
}
exports.deleteDramaById =function(id,callback){
    const query = 'DELETE FROM dramas WHERE dramaID = ?'
    const values = [id]
    db.query(query,values, function(error){
        if(error){
         callback(['internalError'],null)
        }else{
            callback([], null)
        }
    })
}

return exports

}