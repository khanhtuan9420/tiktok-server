const express = require('express');
const router = express.Router();
// const fileUploader = require('../config/cloudinaryImage.config');
const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');
const {checkType, uploadImageCloud, uploadVideoCloud, deleteFile} = require('../config/cloudinary.config')

router.post('/', (req, res, next) => {
    uploadImageCloud.single('file')(req, res, async function (err) {
        if (err) {
            console.log('Error uploading file: ', err);
            return res.status(500).json({ error: 'Error uploading file' });
        }
        // if (!req.file) {
        //     console.log('No file uploaded');
        //     // res.status(400).json({ error: 'No file uploaded' });
        // }
        const { nickname, fullname, oldNickname } = req.body;
        let updateData = {
            nickname,
            "full_name": fullname
        }
        if(req.file) {
            const indexOfExtend = req.body.oldAvatar.indexOf('.',68)
            const oldAvatarId = req.body.oldAvatar.slice(68, indexOfExtend)
            deleteFile(`image/${oldAvatarId}`)
            updateData = {...updateData, avatar: req.file.path}
        }
        var query = `update user set ? where nickname = ?`
        const conn = await connectionAsync().catch(e => { })
        const results = await useQuery(conn, query, [updateData, oldNickname]).catch(console.log);
        res.json({ message: "success" });
    });
});


module.exports = router;
