const connection = require('../service/sql')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt
    var query = `select * from user where refresh_token = '${refreshToken}';`
    connection.acquire(function (err, con) {
        con.query(query, async function (err, result) {
            con.release()
            if (!result) res.sendStatus(403);
            const myRes=result[0];
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if(err || myRes.id !== decoded.id) {
                        console.log(myRes.id, decoded.id)
                        return res.sendStatus(403);
                    }
                    const accessToken = jwt.sign(
                        {"id": decoded.id},
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: '1m'}
                    )
                    res.json({...result[0], password: '', 'refresh_token': ''})
                }
            )
        });

    });
}

module.exports = { handleRefreshToken }