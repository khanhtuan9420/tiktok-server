const bcrypt = require('bcrypt');
const connection = require('../service/sql')
const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');


const handleNewUser = async (req, res) => {
    const { user, pwd, fullName } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password must be provided' });
    var query = `select * from user where nickname = '${user}';`
    const conn = await connectionAsync  ().catch(e => {}) 
    const results = await useQuery(conn, query).catch(console.log);
    if(!!results[0]) return res.sendStatus(409);
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {"nickname": user, "password": hashedPwd, "full_name": fullName};
        connection.acquire(function(err, con) {
            con.query('insert into user set ?', newUser, function(err, result) {
              con.release();
              if (err) {
                console.log(err);
                res.send({status: 1, message: 'creation failed'});
              } else {
                res.send({status: 0, message: `New user ${user} created successfully`});
              }
            });
          });
    } catch (err) {
      console.log(err)
        res.status(500).json({'message': err.message});
    }

}

module.exports = {handleNewUser}