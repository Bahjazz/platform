const mysql   = require('mysql2')

const connection = mysql.createConnection({
    host:  'database',
    user:  'root',
    password: 'abc123',
    database: 'KdramaUnited'
})

connection.connect(function(err) {
    if (err) {
     // console.error('error connecting: ' + err.stack)
      return;
    }
  
    //console.log('connected as id ' + connection.threadId)
  })

module.exports = connection
