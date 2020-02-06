const express = require('express');
const reviewController = require(`${__dirname}/../controllers/reviewController`);
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router({ mergeParams: true });

//POST /product/664d65s/reviews
//GET /product/664d65s/reviews
//POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
