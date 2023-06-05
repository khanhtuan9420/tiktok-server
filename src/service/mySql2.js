const mysql = require('mysql2');

let instance = null;

async function getPool() {
  if (instance !== null) {
    return instance;
  }

  const pool = await mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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