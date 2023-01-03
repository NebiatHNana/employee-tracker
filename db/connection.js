const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your  MySQL username,
        user: 'nebiatnana',
        // Your MySQL password
        password: 'nana4554',
        database: 'election'
    },
    console.log('Connected to the election database.')
);


module.exports = db;