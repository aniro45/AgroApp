const fs = require('fs');

//Testing Purpose
const Products = require(`${__dirname}/../models/productModel.js`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);

//! Alias top 5 cheap product Route Function
exports.aliasCheapProducts = (Request, Response, next) => {
  Request.query.limit = 5;
  Request.query.sort = 'price,-rating';
  Request.query.fields = 'name,price,weight,component,category,company';
  next();
};

//! Get All Products
exports.getAllproducts = async (Request, Response) => {
  try {
    const features = new APIFeatures(Products.find(), Request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const allProducts = await features.query;

    //! Send Respose
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

//! Aggregation Pipeline

exports.productStats = async (Request, Response) => {
  try {
    const stats = await Products.aggregate([
      {
        $match: { rating: { $gte: 4 } }
      },
      {
        $group: {
          _id: { $toUpper: '$form' },
          numProducts: { $sum: 1 },
          totalRatings: { $sum: '$rating' },
          avgRating: { $avg: '$rating' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // ,{
      //   $match: { _id: { $ne: 'SOLID' } }
      // }
    ]);
    Response.status(200).json({
      message: 'Success',
      RequestedAt: Request.requestTime,
      data: {
        stats
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
