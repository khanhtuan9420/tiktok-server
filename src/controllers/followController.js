const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');


const handleFollow = async (req, res) => {
    const insertVals = {
        following_id: req.body.following_id,
        followed_id: req.body.followed_id
    }
    var query = `insert into follow set ?`
    const conn = await connectionAsync  ().catch(e => {}) 
    const results = await useQuery(conn, query, insertVals).catch(console.log);
    res.send('success')
}

const handleUnfollow = async (req, res) => {
    const {following_id, followed_id} = req.body
    var query = `delete from follow where following_id = ${following_id} and followed_id = ${followed_id}`
    const conn = await connectionAsync  ().catch(e => {console.log(e)}) 
    const results = await useQuery(conn, query).catch(console.log);
    res.send('success')
}

module.exports = {handleFollow, handleUnfollow}