const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');


const search = async (req, res) => {
    var keyword = req.query.q;
    var query = `select * from user where nickname like '%${keyword}%'`
    const conn = await connectionAsync().catch(e => {})
    // console.log(conn)
    const results = await useQuery(conn, query).catch(console.log);
    // conn.release()
    res.send(results)
}

const suggestAccount = async (req, res) => {
    let conditions='1'
    const id = req.query?.id || -1;
    const childQuery = `select * from follow f where f.following_id =${id} and f.followed_id=a.id`
    if(req.query.nickname) conditions = `a.nickname != '${req.query.nickname}'`;
    var query = `select a.id, a.nickname, a.full_name, a.tick, a.avatar from user a where ${conditions} and NOT EXISTS(${childQuery}) ORDER BY RAND() LIMIT 10`
    // console.log(req.query)
    const conn = await connectionAsync().catch(e => {})
    const results = await useQuery(conn, query).catch(console.log);
    // conn.release()
    res.send(results)
}

const followAccounts = async (req, res) => {
    const curUser = req.query?.curUser || -1;
    const childQuery = `select * from follow f where f.following_id =${curUser} and f.followed_id=a.id`
    var query = `select a.id, a.nickname, a.full_name, a.tick, a.avatar, IF(EXISTS(${childQuery}), 1,0) as follow from user a, follow b where b.following_id =${req.query.curUser} and a.id = b.followed_id`
    const conn = await connectionAsync  ().catch(e => {})
    const results = await useQuery(conn, query).catch(console.log);
    // conn.release()
    res.send(results)
}

module.exports = { search, suggestAccount, followAccounts }