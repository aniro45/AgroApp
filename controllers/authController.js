const crypto = require('crypto');
const { promisify } = require('util');
const User = require(`${__dirname}/../models/userModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const jwt = require('jsonwebtoken');
const AppError = require(`${__dirname}/../utils/appError`);
const Email = require(`${__dirname}/../utils/email`);

//! Token creation Credentials
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, Response) => {
  const token = signToken(user._id);

  //Cookie Generation
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //! Only apply when the production envirenment is HTTPS and not HTTP
  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true;
  // }

  Response.cookie('jwt', token, cookieOptions);

  //Remove password from output
  user.password = undefined;

  Response.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

//! User Signup method
exports.signup = catchAsync(async (Request, Response, next) => {
  const newUser = await User.create({
    name: Request.body.name,
    email: Request.body.email,
    role: Request.body.role,
    password: Request.body.password,
    passwordConfirm: Request.body.passwordConfirm,
    passwordChangedAt: Request.body.passwordChangedAt,
    passwordResetToken: Request.body.passwordResetToken,
    passwordResetExpires: Request.body.passwordResetExpires,
    active: Request.body.active,
  });
  const url = `${Request.protocol}://${Request.get('host')}/me`;
  // console.log(url);
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, Response);
});

//! User Login method
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
  createSendToken(user, 200, Response);
});

//! Logout Method
exports.logout = (Request, Response, next) => {
  Response.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  Response.status(200).json({
    status: 'success',
  });
};

//! protect user from changing something without Login
exports.protect = catchAsync(async (Request, Response, next) => {
  //Getting the tokens and check if its exist
  let token;
  if (
    Request.headers.authorization &&
    Request.headers.authorization.startsWith('Bearer')
  ) {
    token = Request.headers.authorization.split(' ')[1];
  } else if (Request.cookies.jwt) {
    token = Request.cookies.jwt;
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
  Response.locals.user = currentUser;
  next();
});

//! Only for rendered Pages and no errors
exports.isLoggedIn = async (Request, Response, next) => {
  if (Request.cookies.jwt) {
    try {
      //verfication of token
      const decoded = await promisify(jwt.verify)(
        Request.cookies.jwt,
        process.env.JWT_SECRET
      );

      //check if user still exist
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //check if user changed password after the token was recieved
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        //iat=issuedAt
        return next();
      }
      //THERE IS LOGGED IN USER
      Response.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

//! Restriction method for users and not admin and dev
exports.restrictTo = (...roles) => {
  return (Request, Response, next) => {
    //roles['admin', 'user', 'dev']
    if (!roles.includes(Request.user.role)) {
      return next(
        new AppError('You do not have permission to perform this Action', 403)
      );
    }
    next();
  };
};

//! Forgot Password Method
exports.forgotPassword = catchAsync(async (Request, Response, next) => {
  //Get User based on POSTED  Email
  const user = await User.findOne({ email: Request.body.email });
  if (!user) {
    return next(new AppError('There no user with that email address', 404));
  }
  //Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    //send it back to user's email
    const resetUrl = `${Request.protocol}://${Request.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordReset();

    Response.status(200).json({
      status: 'success',
      message: 'Token sent to Email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error while sending Email, Try Again later!',
        500
      )
    );
  }
});

//! Reset Passowrd Method
exports.resetPassword = catchAsync(async (Request, Response, next) => {
  //Get user based on tokens
  const hashedToken = crypto
    .createHash('sha256')
    .update(Request.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //If token is not expired, and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = Request.body.password;
  user.passwordConfirm = Request.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //update changedPasswordAt property for the user
  //log the user in, send jwt
  createSendToken(user, 200, Response);
});

//! Update Password Mehtod
exports.updatePassword = catchAsync(async (Request, Response, next) => {
  // Get User From Collection
  const user = await User.findById(Request.user.id).select('+password');

  //Check if Posted password is correct
  if (
    !(await user.correctPassword(Request.body.passwordCurrent, user.password))
  ) {
    return next(new AppError(`Your !`, 401));
  }

  //If correct then update the password
  user.password = Request.body.password;
  user.passwordConfirm = Request.body.passwordConfirm;
  await user.save();
  // User.findOneAndUpdate() will work but pre middleware and validator wont work

  //Log user in, send JWT Token
  createSendToken(user, 200, Response);
});
