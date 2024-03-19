const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/login')
  .post(userController.loginUser);
  
router.route('/:userId')
  .get(userController.getAllUsersExceptCurrent);

module.exports = router;