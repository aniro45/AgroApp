const express = require('express');
const bookingController = require(`${__dirname}/../controllers/bookingController`);
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router();
router.use(authController.protect);

router
  .route('/checkout-session/:productId')
  .get(bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'seller'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
