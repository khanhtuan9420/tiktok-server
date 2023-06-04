
const pool =  require('../service/mySql2')


const handleLike = async (req, res) => {
    const insertVals = {
        userId: req.body.userId,
        videoId: req.body.videoId
    }
    var query = `insert into reaction set ?`
    const conn = await pool
    const results = await conn.query(query, [insertVals])
    res.send('success')
}

const handleDislike = async (req, res) => {
    const {userId, videoId} = req.body
    var query = `delete from reaction where userId = ${userId} and videoId = ${videoId}`
    const conn = await pool
    const results = await conn.execute(query)
    res.send('success')
}

module.exports = {handleDislike, handleLike}