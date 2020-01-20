const fs = require('fs');

const Products = require(`${__dirname}/../models/productModel.js`);

//! Get All Products
exports.getAllproducts = async (Request, Response) => {
  try {
    const allProducts = await Products.find();
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

//! Create New Productss
exports.createNewProduct = async (Request, Response) => {
  try {
    const newProduct = await Products.create(Request.body);
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
  try {
    const product = await Products.findById(Request.params.id);
    //Product.findOne({_id:Request.parma.id})

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
exports.patchProduct = async (Request, Response) => {
  try {
    const patchedProduct = await Products.findByIdAndUpdate(
      Request.params.id,
      Request.body,
      {
        new: true,
        runValidators: true
      }
    );
    Response.status(200).json({
      message: 'Patched Success',
      RequestedAt: Request.requestTime,
      data: {
        patchedProduct
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

//! Delete Product By id
exports.deleteProduct = async (Request, Response) => {
  try {
    await Products.findByIdAndDelete(Request.params.id);

    Response.status(204).json({
      message: 'Delete Success',
      RequestedAt: Request.requestTime,
      // messege: 'Product deleted Successfully',
      data: null
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
