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

exports.getProductsWithin = catchAsync(async (Request, Response, next) => {
  const distance = Request.params.distance;
  const latlng = Request.params.latlng;
  const unit = Request.params.unit;

  const [lat, lng] = latlng.split(',');
  console.log(distance, lat, lng, unit);

  let radius;

  if (unit === 'mi') {
    radius = distance / 3963.2;
    console.log('If Executed as Mile!');
  } else {
    radius = distance / 6378.1;
    console.log('Else Executed as Km or Other!');
  }
  console.log('radius is: ' + radius);

  const products = await Products.find({
    productLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  Response.status(200).json({
    status: 'Success',
    results: products.length,
    data: {
      data: products
    }
  });
});
