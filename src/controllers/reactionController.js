const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');


const handleLike = async (req, res) => {
    const insertVals = {
        userId: req.body.userId,
        videoId: req.body.videoId
    }
    var query = `insert into reaction set ?`
    const conn = await connectionAsync  ().catch(e => {}) 
    const results = await useQuery(conn, query, insertVals).catch(console.log);
    res.send('success')
}

const handleDislike = async (req, res) => {
    const {userId, videoId} = req.body
    var query = `delete from reaction where userId = ${userId} and videoId = ${videoId}`
    const conn = await connectionAsync  ().catch(e => {console.log(e)}) 
    const results = await useQuery(conn, query).catch(console.log);
    res.send('success')
}

module.exports = {handleDislike, handleLike}