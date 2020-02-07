const express = require('express');
const reviewController = require(`${__dirname}/../controllers/reviewController`);
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setProductUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.patchReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = router;
