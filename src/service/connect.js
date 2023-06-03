const mysql = require('mysql');

module.exports = async (params= {
  connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiktok',
      charset: 'utf8mb4',
      collation: 'utf8mb4_turkish_ci'
}) => new Promise(
(resolve, reject) => {
	const connection = mysql.createPool(params);
  connection.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });
  connection.getConnection(error => {
	  if (error) {
      reject(error);
      return;
    }
    resolve(connection);
  })
});