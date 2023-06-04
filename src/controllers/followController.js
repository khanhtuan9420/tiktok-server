
const pool =  require('../service/mySql2')



const handleFollow = async (req, res) => {
    const insertVals = {
        following_id: req.body.following_id,
        followed_id: req.body.followed_id
    }
    var query = `insert into follow set ?`
    const conn = await pool
    const results = await conn.query(query, [insertVals])
    res.send('success')
}

const handleUnfollow = async (req, res) => {
    const {following_id, followed_id} = req.body
    var query = `delete from follow where following_id = ${following_id} and followed_id = ${followed_id}`
    const conn = await pool
    const results = await conn.execute(query)
    res.send('success')
}

module.exports = {handleFollow, handleUnfollow}