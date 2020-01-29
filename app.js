// const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

const productRouter = require(`${__dirname}/routes/productRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);

const AppError = require(`${__dirname}/utils/appError.js`);
const GlobalErrorHandler = require(`${__dirname}/controllers/errorController.js`);

// console.log(app.get('env')); //! to get Environment if it is dev or production

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //!Serving static file in route

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
