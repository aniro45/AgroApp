const AppError = require(`${__dirname}/../utils/appError.js`);

const handleDuplicateFieldsDB = error => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = error => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = error => {
  const errors = Object.values(error.errors).map(el => el.message);
  const message = `Invalid Input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token, Please login Again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired, please log in again', 401);

const sendErrorDev = (error, Request, Response) => {
  // a) API
  if (Request.originalUrl.startsWith('/api')) {
    return Response.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack
    });
  }
  // b) THE RENDERED WEBSITE
  console.log('Error', error);
  return Response.status(error.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: error.message
  });
};

const sendErrorProd = (error, Request, Response) => {
  // a) API
  if (Request.originalUrl.startsWith('/api')) {
    //a) Opeartional, Trusted error : send msg to client.
    if (error.isOperational) {
      return Response.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    }
    // b) programming Or other unkonwn errors : dont leak error details
    //Log Error
    console.log('Error', error);

    //Send generic message
    return Response.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
  // b) RENDERED WEBSITE
  if (error.isOperational) {
    console.log(error);
    return Response.status(error.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: error.message
    });
  }
  //programming Or other unkonwn errors : dont leak error details
  //Log Error
  console.log('Error', error);

  //Send generic message
  return Response.status(statusCode).render('error', {
    title: 'Something Went wrong!',
    msg: 'Please Try again leter!'
  });
};

module.exports = (error, Request, Response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, Request, Response);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    err.message = error.message;

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDb(err);

    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
    sendErrorProd(err, Request, Response);
  }
};
