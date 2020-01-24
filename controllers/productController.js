const fs = require('fs');

const Products = require(`${__dirname}/../models/productModel.js`);

//Alias top 5 cheap product Route Function
exports.aliasCheapProducts = (Request, Response, next) => {
  Request.query.limit = 5;
  Request.query.sort = 'price,-rating';
  Request.query.fields = 'name,price,weight,component,category,company';
  next();
};

//! Get All Products
exports.getAllproducts = async (Request, Response) => {
  try {
    // console.log(Request.query);

    //! Build Query
    // 1A) Filtering
    const queryObj = { ...Request.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(Request.query, queryObj);

    // 2B) Advaced Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    // console.log(JSON.parse(queryString));
    let query = Products.find(JSON.parse(queryString));

    // 2) Sorting
    if (Request.query.sort) {
      const sortBy = Request.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field Limiting
    if (Request.query.fields) {
      const fieldsx = Request.query.fields.split(',').join(' ');
      query = query.select(fieldsx);
    } else {
      query = query.select('-__v');
    }

    // 4) Paagination
    const page = Request.query.page * 1 || 1;
    const limit = Request.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (Request.query.page) {
      const numProducts = await Products.countDocuments();

      if (skip >= numProducts) throw new Error('This page does not exists');
    }

    //

    //! Execute Query
    const allProducts = await query;

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
