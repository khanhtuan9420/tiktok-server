const express = require('express')
const router = express.Router()
const reactionController = require('../controllers/reactionController')

router.post('/like', reactionController.handleLike)
router.post('/dislike', reactionController.handleDislike)

module.exports = router