const mysql = require('mysql2');

let instance = null;

async function getPool() {
  if (instance !== null) {
    return instance;
  }

  const pool = await mysql.createPool({
    connectionLimit: 10,
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'tiktok',
    host: 'sql12.freesqldatabase.com',
    user: 'sql12623446',
    password: 'pRVzcPvYyx',
    database: 'sql12623446',
    port: '3306',
    charset: 'utf8mb4',
    collation: 'utf8mb4_turkish_ci'
  });

  pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });

  instance = pool.promise();
  return instance;
}

module.exports = getPool();