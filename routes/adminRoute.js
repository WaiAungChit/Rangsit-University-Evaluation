const express = require('express');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

router.route('/login')
    .post(adminController.login);

router.route('/signup')
    .post(adminController.signup);

router.route('/delete-admin')
    .all(adminAuth)
    .delete(adminController.deleteAdmin);

router.route('/users')
    .all(adminAuth)
    .post(adminController.createUser)
    .get(adminController.getAllUsers);

router.route('/users/:userId')
    .all(adminAuth)
    .delete(adminController.deleteUser)
    .put(adminController.updateProfilePicture);

router.route('/votes')
    .all(adminAuth) 
    .get(adminController.getAllVotes);

router.route('/change-password')
    .all(adminAuth)
    .put(adminController.changePassword);

router.route('/forgot-password')
    .post(adminController.forgotPassword);

router.route('/update-vote-limit')
    .all(adminAuth)
    .put(adminController.updateVoteLimit);

module.exports = router;