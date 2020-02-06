const express = require('express');
const productController = require(`${__dirname}/../controllers/productController.js`);
const authController = require(`${__dirname}/../controllers/authController`);
const reviewRouter = require(`${__dirname}/../routes/reviewRoutes`);

const router = express.Router();

// router.param('id', productController.checkId);

//POST /products/213458dfdf/reviews
//GET /products/213458dfdf/reviews
//GET /products/213458dfdf/reviews/215df5ef5

// router
//   .route('/:productId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
router.use('/:productId/reviews', reviewRouter);

//! Special Route for top 5 cheap Products
router
  .route('/top-5-cheap')
  .get(productController.aliasCheapProducts, productController.getAllproducts);

//! Testing Route
router.route('/test-route').get();

//! Aggregation Pipeling stats
router.route('/product-stats').get(productController.productStats);

//! Regular Routes
router
  .route('/')
  .get(authController.protect, productController.getAllproducts)
  .post(productController.createNewProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.patchProduct)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    productController.deleteProduct
  );

module.exports = router;
