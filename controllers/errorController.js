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

const sendErrorDev = (error, Response) => {
  Response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack
  });
};

const sendErrorProd = (error, Response) => {
  //Opeartional, Trusted error : send msg to client.
  if (error.isOperational) {
    console.log('isOperation runining');
    Response.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
    //programming Or other unkonwn errors : dont leak error details
  } else {
    //Log Error
    console.log('Error', error);
    //Send generic message
    Response.status(500).json({
      status: 'error',
      message: 'something went Wrong!'
    });
  }
};
module.exports = (error, Request, Response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, Response);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDb(err);

    sendErrorProd(err, Response);
  }
};
