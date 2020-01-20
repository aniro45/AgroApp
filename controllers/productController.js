const fs = require('fs');

const Products = require(`${__dirname}/../models/productModel.js`);

//! Get All Products
exports.getAllproducts = async (Request, Response) => {
  const allProducts = await Products.find();

  try {
    Response.status(200).json({
      Status: 'Successfull',
      RequestedAt: Request.requestTime,
      results: allProducts.length,
      data: {
        allProducts
      }
    });
  } catch (error) {
    Response.status(404).json({
      status: 'Failed',
      message: {
        Error: error
      }
    });
  }
};

//! Create New Product
exports.createNewProduct = async (Request, Response) => {
  const newProduct = await Products.create(Request.body);
  try {
    Response.status(201).json({
      Status: 'Successfull',
      RequestedAt: Request.requestTime,
      data: {
        FileData: newProduct
      }
    });
  } catch (error) {
    Response.status(400).json({
      status: 'Failed',
      message: {
        Error: error
      }
    });
  }
};

//! Get Single Product By ID
exports.getProduct = async (Request, Response) => {
  const product = await Products.findById(Request.params.id);
  //Product.findOne({_id:Request.parma.id})
  try {
    Response.status(404).json({
      message: 'Success',
      RequestedAt: Request.requestTime,
      data: {
        product
      }
    });
  } catch (error) {
    Response.status(404).json({
      stauts: 'Failed',
      message: {
        Error: error
      }
    });
  }
};

//! update the Patch for the Product
exports.patchProduct = (Request, Response) => {
  Response.status(404).json({
    message: 'Patched Success',
    RequestedAt: Request.requestTime,
    data: {
      product: '<update patch updated>'
    }
  });
};

//! Delete Product By id
exports.deleteProduct = (Request, Response) => {
  Response.status(404).json({
    message: 'Delete Success',
    RequestedAt: Request.requestTime,
    data: {
      product: null
    }
  });
};
