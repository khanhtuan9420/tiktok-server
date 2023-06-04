
const pool =  require('../service/mySql2')



const handleEditProfile = async (req, res) => {
    const { avatar, nickname, fullname, oldNickname } = req.body;
    
    var query = `update user set ? where nickname = ?`
    const conn = await pool;
    const results = await conn.query(query, [{avatar, nickname, "full_name": fullname}, oldNickname])
    res.send('success')
}

module.exports = {handleEditProfile}