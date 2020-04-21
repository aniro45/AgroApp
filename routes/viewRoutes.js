const express = require('express');
const viewsController = require(`${__dirname}/../controllers/viewsController`);
const authController = require(`${__dirname}/../controllers/authController`);
const bookingController = require(`${__dirname}/../controllers/bookingController`);

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewsController.getProduct
);

router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/forgot-password', viewsController.forgotPasswordForm);
router.get('/reset-password', viewsController.resetPasswordForm);

router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-products',
  authController.protect,
  viewsController.getMyProduct
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
