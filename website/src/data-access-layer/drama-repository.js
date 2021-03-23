const db = require('./db')
module.exports = function(){

const exports = {}



exports.getAllDramas = function(callback){
    const query = 'SELECT * FROM dramas ORDER BY id DESC'
    const values = []
    db.query(query, values, function(error, dramas){
        console.log(dramas)
        if(error){
            callback(['internalError'], null)
        }else{
            callback([],dramas)
        }
    })
}

exports.getDramaById = function(id, callback){
    const query = "SELECT * FROM dramas WHERE id =? LIMIT 1"
    const values = [id]
    db.query(query, values, function(error, dramas){
        console.log(error)
        console.log(dramas)
        if(error){
            callback(['internalError'], null)
        }else{
            callback([],dramas[0])
        }
    })
}


exports.createDrama = function(drama, callback){
    const query = ' INSERT INTO dramas(name, description) VALUES(?, ?)'
    const values = [drama.name, drama.description]
    db.query(query, values, function(error, results){
        if(error){
            console.log(error.sqlMessage)
                 callback(['internalError', null])
        }else{
            console.log(results)
            callback([],results.insertId)
        }
    })
}

exports.updateDrama = function(account, callback){
   const query = `updata drama SET username =? WHERE username = ?`
   const values = [account.username]
   db.query(query, values, function(error){
       if(error){
           callback(['internalError'])
       }

   })
}
exports.deleteDrama =function(account,callback){
    const query = 'DELETE FROM a accounts WHERE username = ?'
    const values = [account.username]
    db.query(query, function(error){
        if(error){
         callback(['internalError'])
        }
    })
}

return exports

}