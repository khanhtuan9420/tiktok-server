const express = require('express');
const router = express.Router();
const {uploadVideoCloud} = require('../config/cloudinary.config');
const pool =  require('../service/mySql2')

router.post('/', (req, res, next) => {
    uploadVideoCloud.single('file')(req, res, async function (err) {
      if (err) {
        console.log('Error uploading file: ', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }
      if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const query = 'insert into video set ?'
      const conn = await pool
      const endSlice = req.file.path.indexOf('.mp4')
      const valueInsert = {
        videoId: req.file.path.slice(68, endSlice),
        caption: req.body.caption,
        userId: req.body.userId
      }
      const results = await conn.query(query, valueInsert)
      res.json({ message: "success" });
    });
  });
  

module.exports = router;
