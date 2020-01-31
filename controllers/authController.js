const { promisify } = require('util');
const User = require(`${__dirname}/../models/userModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const jwt = require('jsonwebtoken');
const AppError = require(`${__dirname}/../utils/appError`);

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (Request, Response, next) => {
  const newUser = await User.create({
    name: Request.body.name,
    email: Request.body.email,
    password: Request.body.password,
    passwordConfirm: Request.body.passwordConfirm,
    passwordChangedAt: Request.body.passwordChangedAt
  });
  const token = signToken(newUser._id);

  Response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (Request, Response, next) => {
  const { email, password } = Request.body;

  //check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //check if user exist and password correct

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or Password', 401));
  }
  //if evrything ok ,send token to client
  const token = signToken(user._id);
  console.log(token);
  Response.status(200).json({
    status: 'success',
    token: token
  });
});

exports.protect = catchAsync(async (Request, Response, next) => {
  //Getting the tokens and check if its exist
  let token;
  if (
    Request.headers.authorization &&
    Request.headers.authorization.startsWith('Bearer')
  ) {
    token = Request.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in, Please login to get access', 401)
    );
  }

  //verfication of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist!',
        401
      )
    );
  }

  //check if user changed password after the token was recieved

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    //iat=issuedAt
    return next(
      new AppError('User Recently changed password!PLease Login Again.', 401)
    );
  }
  //GRANT  ACCESS DATA TO PROTECTED ROUT!
  Request.user = currentUser;
  next();
});
