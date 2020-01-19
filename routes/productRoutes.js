const express = require('express');
const productController = require(`${__dirname}/../controllers/productController.js`);

const router = express.Router();

router.param('id', productController.checkId);

router
  .route('/')
  .get(productController.getAllproducts)
  .post(productController.checkBody, productController.createNewProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.patchProduct)
  .delete(productController.deleteProduct);

module.exports = router;
