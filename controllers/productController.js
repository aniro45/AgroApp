const fs = require('fs');

//Testing Purpose
const Products = require(`${__dirname}/../models/productModel.js`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);
const factory = require(`${__dirname}/handlerFactory`);

//! Alias top 5 cheap product Route Function
exports.aliasCheapProducts = (Request, Response, next) => {
  Request.query.limit = 5;
  Request.query.sort = 'price,-rating';
  Request.query.fields = 'name,price,weight,component,category,company';
  next();
};

//! Get Full list of
exports.allProduxes = catchAsync(async (Request, Response, next) => {
  const getFullList = Products.find();
});

//! Get All Products
exports.getAllproducts = factory.getAll(Products);

//! Create New Product
exports.createProduct = factory.createOne(Products);

//! Get Single Product By ID
exports.getProduct = factory.getOne(Products, { path: 'reviews' });

//! update the Patch for the Product
exports.patchProduct = factory.updateOne(Products);

//! Delete Product By id
exports.deleteProduct = factory.deleteOne(Products);

//! Aggregation Pipeline
exports.productStats = catchAsync(async (Request, Response, next) => {
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

// products-within?distance=233&center=-40,45&unit=mi
// products-within/233/18.448048, 73.858400/unit/mi
//{{URL}}/api/v1/products/sellers-within/233/center/18.448048, 73.858400/unit/mi

exports.getProductsWithin = catchAsync(async (Request, Response, next) => {
  const { distance, latlng, unit } = Request.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in their respective format',
        400
      )
    );
  }

  console.log(distance, lat, lng, unit);

  const products = await Products.find({
    productLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  console.log('Products: ' + products);

  Response.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      data: products
    }
  });
});
