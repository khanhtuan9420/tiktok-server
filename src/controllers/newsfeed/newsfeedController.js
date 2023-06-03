const connection = require('../../service/sql')


const handleNewsFeed = (req, res) => {
    const curUser = req.query?.curUser || -1;
    const checkFollowQuery = `select * from follow f where f.following_id =${curUser} and f.followed_id=u.id`
    const checkLikedQuery = `select * from reaction r where r.userId =${curUser} and r.videoId=v.id`
    var query = `
    SELECT 
    u.*, 
    v.id AS vId, 
    v.videoId, 
    v.caption, 
    IF(EXISTS(${checkFollowQuery}), 1, 0) AS follow, 
    IF(EXISTS(${checkLikedQuery}), 1, 0) AS isLiked, 
    COUNT(DISTINCT c.id) AS comment, 
    COUNT(DISTINCT r.userId) AS likes 
  FROM 
    user u 
    INNER JOIN video v ON u.id = v.userId 
    LEFT JOIN comment c ON v.id = c.videoId 
    LEFT JOIN reaction r ON v.id = r.videoId 
  GROUP BY 
    v.id 
  ORDER BY 
    RAND() 
  LIMIT 5;
    `
    // console.log(query)
    connection.acquire(function (err, con) {
        con.query(query, function (err, result) {
            con.release();
            res.send(result);
        });
    });
}

const handleLoadMore = (req, res) => {
    const curUser = req.body?.curUser || -1;
    const previousIds = req.body.previousIds || [];
    const excludedIds = previousIds.length > 0 ? `NOT IN (${previousIds.join(',')})` : '';
    const checkFollowQuery = `select * from follow f where f.following_id =${curUser} and f.followed_id=a.id`
    const checkLikedQuery = `select * from reaction r where r.userId =${curUser} and r.videoId=b.id`
    const query = `SELECT a.*, b.id as vId, b.videoId, b.caption, IF(EXISTS(${checkFollowQuery}), 1,0) as follow, IF(EXISTS(${checkLikedQuery}), 1, 0) AS isLiked, COUNT(DISTINCT c.id) as comment, COUNT(DISTINCT r.userId) AS likes FROM user a INNER JOIN video b ON a.id = b.userId AND b.id ${excludedIds} LEFT JOIN comment c ON b.id = c.videoId LEFT JOIN reaction r ON b.id = r.videoId GROUP BY b.id ORDER BY RAND() LIMIT 5;`;
    // console.log(query);
    connection.acquire(function (err, con) {
        con.query(query, function (err, result) {
            con.release();
            res.send(result);
        });
    });
}

module.exports = { handleNewsFeed, handleLoadMore }