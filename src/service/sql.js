const mysql = require('mysql')

function Connection() {
  this.pool = null;
  
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'sql12.freesqldatabase.com',
      user: 'sql12623446',
      password: 'pRVzcPvYyx',
      database: 'sql12623446',
      // host: 'localhost',
      // user: 'root',
      // password: '',
      // database: 'tiktok',
      // host: 'sql101.epizy.com',
      // user: 'epiz_34351094',
      // password: 'mMd1Jo9MBEZi6j',
      // database: 'epiz_34351094_tiktokdb',
      // port: '3306',
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