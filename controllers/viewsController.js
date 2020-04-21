const Product = require(`${__dirname}/../models/productModel`);
const User = require(`${__dirname}/../models/userModel`);
const Review = require(`${__dirname}/../models/reviewModel`);
const Booking = require(`${__dirname}/../models/bookingModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

exports.getOverview = catchAsync(async (Request, Response, next) => {
  //get product data from collection
  const products = await Product.find();
  const reviews = await Review.find();

  //build template

  //render that template using the data from 1

  Response.status(200).render('overview', {
    title: 'All Products',
    products,
  });
});

exports.getProduct = async (Request, Response, next) => {
  // 1) get the data for requested product(includieng review and salers)

  const product = await Product.findOne({ slug: Request.params.slug }).populate(
    {
      path: 'reviews',
      fields: 'review rating user',
    }
  );

  if (!product) {
    return next(new AppError('There is no product with that name', 404));
  }

  //2) Build template

  //3) Render Template using the data from step 1 again
  Response.status(200).render('product', {
    title: `${product.name}`,
    product,
  });
};

exports.getLoginForm = (Request, Response) => {
  Response.status(200).render('login', {
    title: 'Log into Your Account',
  });
};

exports.getAccount = (Request, Response) => {
  Response.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.getSignupForm = (Request, Response) => {
  Response.status(200).render('signup', {
    title: 'Create New Account',
  });
};

exports.forgotPasswordForm = (Request, Response) => {
  Response.status(200).render('forgotPassword', {
    title: 'Recover Your Password',
  });
};

exports.resetPasswordForm = (Request, Response) => {
  Response.status(200).render('resetPassword', {
    title: 'Set New Password',
  });
  console.log(Request.params);
  console.log(Request.body);
  
};

exports.getMyProduct = catchAsync(async (Request, Response, next) => {
  //1) Find All bookings
  const bookings = await Booking.find({ user: Request.user.id });

  //2)Find product with returned IDs
  const productIds = bookings.map((el) => el.product);
  const products = await Product.find({ _id: { $in: productIds } });

  Response.status(200).render('overview', {
    title: 'My Products',
    products,
  });
});

exports.updateUserData = catchAsync(async (Request, Response, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    Request.user.id,
    {
      name: Request.body.name,
      email: Request.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  Response.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});
