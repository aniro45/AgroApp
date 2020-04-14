const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Products = require(`${__dirname}/../models/productModel.js`);
const Booking = require(`${__dirname}/../models/bookingModel.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);
const factory = require(`${__dirname}/handlerFactory`);

exports.getCheckoutSession = catchAsync(async (Request, Response, next) => {
  //1)Get the currentlu booked product

  const product = await Products.findById(Request.params.productId);

  //2)Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${Request.protocol}://${Request.get('host')}/?product=${
      Request.params.productId
    }&user=${Request.user.id}&price=${product.price}`,
    cancel_url: `${Request.protocol}://${Request.get('host')}/product/${
      product.slug
    }`,
    customer_email: Request.user.email,
    client_reference_id: Request.params.productId,
    line_items: [
      {
        name: `${product.name} Product`,
        description: product.component,
        images: [`https://www.natours.dev/img/products/${product.imageCover}`],
        amount: product.price * 100,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });

  //3)Create seesion as respose

  Response.status(200).json({
    stauts: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (Request, Response, next) => {
  //This is only temperary bcz its unseccure and everyone can make booking without paying
  const product = Request.query.product;
  const user = Request.query.user;
  const price = Request.query.price;

  if (!product && !user && !price) return next();
  await Booking.create({ product, user, price });

  Response.redirect(Request.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
