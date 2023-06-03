const express = require('express')
const router = express.Router()
const searchController = require('../controllers/searchController')

router.get('/', searchController.search)
router.get('/suggestAccount', searchController.suggestAccount)
router.get('/follow', searchController.followAccounts)
module.exports = router