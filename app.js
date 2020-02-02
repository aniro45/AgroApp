// const fs = require('fs'  );
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const productRouter = require(`${__dirname}/routes/productRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);

const AppError = require(`${__dirname}/utils/appError.js`);
const GlobalErrorHandler = require(`${__dirname}/controllers/errorController.js`);

// console.log(app.get('env')); //! to get Environment if it is dev or production

//! Set security HTTP headers
app.use(helmet());

//! Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//! Limiter to get secure from DOS attack(limit Req from same IP)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many Request from this IP, PLease Try again later!'
});
app.use('/api', limiter);

//! Body parser, REasing data from body into request.body
app.use(express.json({ limit: '10kb' }));

//! Data Sanitization Against NoSQL query Injection
app.use(mongoSanitize());

//! Data sanitization Against XSS(Cross site Scripting) attack
app.use(xss());

//! Prevent HTTP parameter pollution(pp)
app.use(
  hpp({
    whitelist: [
      'name',
      'price',
      'rating',
      'weight',
      'company',
      'totalQuantity',
      'form',
      'unit'
    ]
  })
);

//!Serving static file in route
app.use(express.static(`${__dirname}/public`));

//! Sample to check request
app.use((Request, Response, next) => {
  console.log('Hello From ॐ  Middleware!');
  next();
});

//! To get the time of request
app.use((Request, Response, next) => {
  Request.requestTime = new Date().toISOString();
  next();
});

//! Blanked Route
const blankRoute = (Request, Response) => {
  Response.send('Fuck You....!!!');
};

//! Routes Middleware
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.route('/').get(blankRoute);

//! Error handling for wrong URL
app.all('*', (Request, Response, next) => {
  next(new AppError(`Can Not Find ${Request.originalUrl} URL in Server!`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
