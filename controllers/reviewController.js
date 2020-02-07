const Review = require(`${__dirname}/../models/reviewModel`);
// const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const factory = require(`${__dirname}/handlerFactory`);

exports.setProductUserIds = (Request, Response, next) => {
  if (!Request.body.product) Request.body.product = Request.params.productId;
  if (!Request.body.user) Request.body.user = Request.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.patchReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
