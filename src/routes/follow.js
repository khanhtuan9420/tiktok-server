const express = require('express')
const router = express.Router()
const connectionAsync = require('../service/connect');
const useQuery = require('../service/query');
const followControllers = require('../controllers/followController')

router.post('/', followControllers.handleFollow)
router.post('/unfollow', followControllers.handleUnfollow)

module.exports = router