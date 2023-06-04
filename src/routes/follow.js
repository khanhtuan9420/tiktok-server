const express = require('express')
const router = express.Router()
const followControllers = require('../controllers/followController')

router.post('/', followControllers.handleFollow)
router.post('/unfollow', followControllers.handleUnfollow)

module.exports = router