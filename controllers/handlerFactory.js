const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);

exports.deleteOne = Model =>
  catchAsync(async (Request, Response, next) => {
    const doc = await Model.findByIdAndDelete(Request.params.id);
    if (!doc) {
      return next(new AppError('No Document found with this ID!', 404));
    }
    Response.status(204).json({
      message: 'Success',
      RequestedAt: Request.requestTime,
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (Request, Response, next) => {
    const doc = await Model.findByIdAndUpdate(Request.params.id, Request.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No Product found with this ID!', 404));
    }
    Response.status(200).json({
      message: 'Patched Success',
      RequestedAt: Request.requestTime,
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (Request, Response, next) => {
    const doc = await Model.create(Request.body);
    Response.status(201).json({
      Status: 'Successfull',
      RequestedAt: Request.requestTime,
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (Request, Response, next) => {
    let query = Model.findById(Request.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No Product found with this ID!', 404));
    }

    Response.status(404).json({
      message: 'Success',
      RequestedAt: Request.requestTime,
      data: {
        doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (Request, Response, next) => {
    //To allow fo nested GET review on Product
    let filter = {};
    if (Request.params.productId)
      filter = { product: Request.params.productId };

    const features = new APIFeatures(Model.find(filter), Request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const docs = await features.query.explain(); //explain stats of Query
    const docs = await features.query;

    //! Send Response
    Response.status(200).json({
      Status: 'Successfull',
      RequestedAt: Request.requestTime,
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
