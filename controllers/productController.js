const fs = require('fs');

//Testing Purpose
const Products = require(`${__dirname}/../models/productModel.js`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
const catchAsyncError = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);
const factory = require(`${__dirname}/handlerFactory`);

//! Alias top 5 cheap product Route Function
exports.aliasCheapProducts = (Request, Response, next) => {
  Request.query.limit = 5;
  Request.query.sort = 'price,-rating';
  Request.query.fields = 'name,price,weight,component,category,company';
  next();
};

//! Get All Products
exports.getAllproducts = catchAsyncError(async (Request, Response, next) => {
  console.log(process.env.NODE_ENV);

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
});

//! Create New Product
exports.createNewProduct = catchAsyncError(async (Request, Response, next) => {
  const newProduct = await Products.create(Request.body);
  Response.status(201).json({
    Status: 'Successfull',
    RequestedAt: Request.requestTime,
    data: {
      FileData: newProduct
    }
  });
});

//! Get Single Product By ID
exports.getProduct = catchAsyncError(async (Request, Response, next) => {
  const product = await Products.findById(Request.params.id).populate(
    'reviews'
  );
  //Product.findOne({_id:Request.parma.id})

  if (!product) {
    return next(new AppError('No Product found with this ID!', 404));
  }
  Response.status(404).json({
    message: 'Success',
    RequestedAt: Request.requestTime,
    data: {
      product
    }
  });
});

//! update the Patch for the Product
exports.patchProduct = catchAsyncError(async (Request, Response, next) => {
  const patchedProduct = await Products.findByIdAndUpdate(
    Request.params.id,
    Request.body,
    {
      new: true,
      runValidators: true
    }
  );
  if (!patchedProduct) {
    return next(new AppError('No Product found with this ID!', 404));
  }
  Response.status(200).json({
    message: 'Patched Success',
    RequestedAt: Request.requestTime,
    data: {
      patchedProduct
    }
  });
});

//! Delete Product By id
exports.deleteProduct = factory.deleteOne(product);

// exports.deleteProduct = catchAsyncError(async (Request, Response, next) => {
//   const product = await Products.findByIdAndDelete(Request.params.id);
//   if (!product) {
//     return next(new AppError('No Product found with this ID!', 404));
//   }
//   Response.status(204).json({
//     message: 'Delete Success',
//     RequestedAt: Request.requestTime,
//     data: null
//   });
// });

//! Aggregation Pipeline

exports.productStats = catchAsyncError(async (Request, Response, next) => {
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
});
