const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 5500
require('dotenv').config()
const cors = require('cors')
const pool =  require('./service/mySql2')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/cridentials')
const corsOptions = require('./config/corsOptions')
const fs = require('fs')
const http = require('http')


app.use(credentials)
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

// connection.init();
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
app.use('/feed', require('./routes/newsfeed'))
app.use('/upload', require('./routes/uploadVideo'))
app.use('/editProfile', require('./routes/editProfile'))
app.use('/search', require('./routes/search'))
app.use('/follow', require('./routes/follow'))
app.use('/reaction', require('./routes/reaction'))



app.get('/video/:videoId', async (req, res) => {
  const videoId = encodeURIComponent(req.params.videoId);
  const curUser = req.query?.curUser || -1;
  // console.log(req.query)
  const checkFollowQuery = `select * from follow f where f.following_id =${curUser} and f.followed_id=a.id`
  const checkLikedQuery = `select * from reaction r where r.userId =${curUser} and r.videoId=b.id`
  const query = `select a.id, a.nickname, a.full_name, a.tick, a.avatar, b.id as vId, b.caption,b.allow_comment as allowComment, COUNT(DISTINCT c.id) as comment, COUNT(DISTINCT d.userId) as likes, IF(EXISTS(${checkFollowQuery}), 1,0) as follow, IF(EXISTS(${checkLikedQuery}), 1, 0) AS isLiked from user a INNER JOIN video b ON b.videoId = '${videoId}' and b.userId = a.id LEFT JOIN comment c ON b.id = c.videoId LEFT JOIN reaction d ON b.id = d.videoId GROUP BY b.id`
  const conn = await pool;
  const results = await conn.execute(query)
  res.json(results[0])
})

app.post('/video/edit/:videoId', async (req, res) => {
  const videoId = encodeURIComponent(req.params.videoId);
  const query = 'update video set ? where videoId = ?'
  const conn = await pool
  const allowComment = req.body.allowComment ? 1 : 0
  const results = await conn.query(query, [{"allow_comment": allowComment}, videoId])
  res.json(results)
})

app.get('/user/:username', async (req, res) => {
  const username = req.params.username;
  const query = `select * from user where user.nickname ='${username}'`
  const query2 = `select b.id, b.videoId, b.caption from user a, video b where a.nickname ='${username}' and a.id=b.userId order by b.id desc;`
  const conn = await pool
  const results = await conn.execute(query)
  const results2 = await conn.execute(query2)
  const videoList = []
  results2.forEach(e => {
    videoList.push(e)
  });
  res.json({...results[0][0],videoList: [...videoList[0]], ['refresh_token']: '', password: ''});
})

app.get('/video/:videoId/comments', async (req, res) => {
  const videoId = encodeURIComponent(req.params.videoId);
  const query = `select a.*, c.nickname, c.avatar from comment a, video b, user c where a.videoId = b.id and a.userId = c.id and b.videoId = '${videoId}' order by a.update_At asc`
  const conn = await pool
  const results = await conn.execute(query)
  res.json(results[0])
})

app.get('/', (req, res) => {
  return res.sendFile(__dirname + "/index.html")
})


const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "https://khanhtuan-tiktok.vercel.app",
    }
  }); 
  // nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được. 


socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected " + socket.id); 
  
  socket.on("subscribe", (room) => {
    // console.log(`Client subscribe room ${room}`)
    socket.join(room)
  })

  socket.on('unsubscribe', (room) => {  
    // console.log('leaving room', room);
    socket.leave(room); 
  })

  socket.on("send", async function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    let query = `select id from video where videoId = '${data.msg.videoId}' `
    const conn = await pool
    const id = await conn.query(query)
    const comment = {
        videoId: id[0][0].id,
        content: data.msg.content,
        userId: data.msg.userId
    }
    const results = await conn.query('insert into comment set ?', [comment] )
    socketIo.in(data.room).emit("message", { data: data.msg });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    // console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(5501, () => {
  console.log('Server đang chay tren cong 3000');
});

// app.use(verifyJWT)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})