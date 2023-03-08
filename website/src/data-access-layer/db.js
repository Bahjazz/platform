const mysql   = require('mysql')

const connection = mysql.createConnection({
    host:  'database',
    user:  'root',
    password: 'abc123',
    database: 'KdramaUnited'
})



module.exports = connection
