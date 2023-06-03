const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');


const handleEditProfile = async (req, res) => {
    const { avatar, nickname, fullname, oldNickname } = req.body;
    
    var query = `update user set ? where nickname = ?`
    const conn = await connectionAsync  ().catch(e => {}) 
    const results = await useQuery(conn, query, [{avatar, nickname, "full_name": fullname}, oldNickname]).catch(console.log);
    
}

module.exports = {handleEditProfile}