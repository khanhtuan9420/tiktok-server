const express = require('express')
const router = express.Router()
const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');
const reactionController = require('../controllers/reactionController')

router.post('/like', reactionController.handleLike)
router.post('/dislike', reactionController.handleDislike)

module.exports = router