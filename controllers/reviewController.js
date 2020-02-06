const Review = require(`${__dirname}/../models/reviewModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

exports.getAllReviews = catchAsync(async (Request, Response, next) => {
  let filter = {};

  if (Request.params.productId) filter = { product: Request.params.productId };
  const reviews = await Review.find(filter);
  Response.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (Request, Response, next) => {
  if (!Request.body.product) Request.body.product = Request.params.productId;
  if (!Request.body.user) Request.body.user = Request.user.id;

  const newReview = await Review.create(Request.body);
  Response.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
