const mysql = require('mysql')
require('dotenv').config();

function Connection() {
  this.pool = null;
  
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
      collation: 'utf8mb4_turkish_ci'
    });
    this.pool.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId);
    });
  };
  
  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

const connection = new Connection()
connection.init()

module.exports = connection;