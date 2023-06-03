const mysql = require('mysql');

module.exports = async (params= {
  connectionLimit: 10,
      host: 'sql12.freesqldatabase.com',
      user: 'sql12623446',
      password: 'pRVzcPvYyx',
      database: 'sql12623446',
      port: '3306',
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