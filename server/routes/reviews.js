const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/user');
const ReviewCtrl = require('../controllers/review');


router.get('', ReviewCtrl.getReviews);
router.post('', UserCtrl.authMiddleware, ReviewCtrl.createReview);
router.get('/:id/rating', ReviewCtrl.getRentalRating);


module.exports = router;
