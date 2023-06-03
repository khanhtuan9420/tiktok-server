const mysql = require('mysql')

function Connection() {
  this.pool = null;
  
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiktok',
      charset: 'utf8mb4',
      collation: 'utf8mb4_turkish_ci'
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