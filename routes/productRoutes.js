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

//! GeoSpatial Routes
// products-within?distance=233&center=-40,45&unit=mi
// products-within/233/-40,45/unit/mi
router
  .route('/products-within/:distance/center/:latlng/unit/:unit')
  .get(productController.getProductsWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(productController.getDistances);

//! Regular Routes
router
  .route('/')
  .get(productController.getAllproducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    productController.patchProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    productController.deleteProduct
  );

module.exports = router;
