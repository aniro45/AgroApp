// const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

const productRouter = require(`${__dirname}/routes/productRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);

// console.log(app.get('env')); //! to get Environment if it is dev or production

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //!Serving static file in route

app.use((Request, Response, next) => {
  console.log('Hello From ॐ  Middleware!');
  next();
});

app.use((Request, Response, next) => {
  Request.requestTime = new Date().toISOString();
  next();
});

//! Blanked Route
const blankRoute = (Request, Response) => {
  Response.send('Fuck You....!!!');
};

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.route('/').get(blankRoute);

module.exports = app;
