const bcrypt = require('bcrypt')
const connection = require('../service/sql')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password must be provided' });
    var query = `select * from user where nickname = '${user}';`
    connection.acquire(function (err, con) {
        con.query(query, async function (err, result) {
            if (!result || !result[0]) {
                return res.sendStatus(401);
            }
            const match = await bcrypt.compare(pwd, result[0].password);
            if (match) {
                const accessToken = jwt.sign(
                    { "id": result[0].id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m' }
                )
                const refreshToken = jwt.sign(
                    { "id": result[0].id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                )
                con.query(`update user set ? where nickname = ?`, [{ "refresh_token": refreshToken }, result[0].nickname],
                 function (err, result) {
                    con.release();
                    if(err) {
                        console.log(err);
                        res.sendStatus(400);
                    }
                })
                res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
                res.json({...result[0], password: '', 'refresh_token': '', accessToken})
            } else {
                res.sendStatus(401)
            }
        });

    });
}

module.exports = { handleLogin }