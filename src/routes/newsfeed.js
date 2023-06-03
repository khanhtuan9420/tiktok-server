const express = require('express')
const router = express.Router()
const newsfeedController = require('../controllers/newsfeed/newsfeedController')

router.get('/', newsfeedController.handleNewsFeed)
router.post('/', newsfeedController.handleLoadMore)
module.exports = router