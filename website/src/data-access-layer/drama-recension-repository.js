const db = require ('./db')

module.exports = function (){

    const exports = {}

   exports.getAllDramaRecension = function(callback){
    const query = 'SELECT *  FROM dramaRecensions ORDER BY id DESC'
    const values = []

       db.query(query,values,function(error,dramaRecensions){
           console.log('QUERY:'+ dramaRecensions )
           if(error){
            callback(['internalError'],null)

           }else{
           callback([],dramaRecensions)
           }
       })
   }
   exports.getDramaRecensionById = function(id, callback){
       const query =  "SELECT * FROM dramaRecensions WHERE id = ? LIMIT 1"
       const values = [id]
       db.query(query,values,function(error,dramaRecensions){
           console.log(error)
           console.log(dramaRecensions)
           if(error){
               callback(['internalError'], null)
           }else{
               callback([],dramaRecensions[0])
           }
       })
   }

   exports.createDramaRecension = function(dramaRecension,callback){
    const query = `INSERT INTO dramaRecensions (name, description) VALUES (?, ?)` 
    const values = [dramaRecension.name, dramaRecension.description]
    db.query(query, values, function(error,results){
        if(error){
            console.log(error.sqlMessage)
                 callback(['internalError'],null)

        }else{
         console.log(results)
         callback([], results.insertId)
        }
    })
}
   return exports
}
