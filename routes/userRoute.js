const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/:userId').get(userController.getAllUsersExceptCurrent);

module.exports = router;