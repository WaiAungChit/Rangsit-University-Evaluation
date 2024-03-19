const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const averageRatingController = require('../controllers/averageRatingController');

router.route('/')
    .all(adminAuth)
    .get(averageRatingController.getAllAverageRatings);

router.route('/date/:date')
    .all(adminAuth)
    .get(averageRatingController.getAverageRatingsForDate);

router.route('/week/:date')
    .all(adminAuth)
    .get(averageRatingController.getAverageRatingsForWeek);

module.exports = router;

