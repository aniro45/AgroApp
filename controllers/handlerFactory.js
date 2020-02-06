const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

exports.deleteOne = Model =>
  catchAsync(async (Request, Response, next) => {
    const doc = await Model.findByIdAndDelete(Request.params.id);
    if (!doc) {
      return next(new AppError('No Product found with this ID!', 404));
    }
    Response.status(204).json({
      message: 'Success',
      RequestedAt: Request.requestTime,
      data: null
    });
  });
