const express = require('express');
const productController = require(`${__dirname}/../controllers/productController.js`);

const router = express.Router();

// router.param('id', productController.checkId);

//Special Route for top 5 cheap Products
router
  .route('/top-5-cheap')
  .get(productController.aliasCheapProducts, productController.getAllproducts);

//Aggregation Pipeling stats
router.route('/product-stats').get(productController.productStats);

//Regular Routes
router
  .route('/')
  .get(productController.getAllproducts)
  .post(productController.createNewProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.patchProduct)
  .delete(productController.deleteProduct);
module.exports = router;
