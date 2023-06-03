const connection = require('../service/sql')

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt
    var query = `select * from user where refresh_token = '${refreshToken}';`
    connection.acquire(function (err, con) {
        con.query(query, async function (err, result) {
            if (!result) {
                res.clearCookie('jwt',{httpOnly: true, sameSite: 'None', secure: true})
                res.sendStatus(204);
            }
            con.query(`update user set ? where refresh_token = ?`, [{ "refresh_token": '' }, result[0].refresh_token],
                 function (err, result) {
                    con.release();
                    if(err) {
                        console.log(err);
                        res.sendStatus(400);
                    }
            })
        });
    });
    res.clearCookie('jwt',{httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(204)
}

module.exports = { handleLogout }