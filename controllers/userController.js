const Products = require(`${__dirname}/../models/productModel.js`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/appError`);

//! This filters data and select only required data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//! This Gives all Users from database
exports.getAllUsers = catchAsync(async (Request, Response) => {
  const allUsers = await User.find();

  Response.status(200).json({
    Status: 'Successfull',
    RequestedAt: Request.requestTime,
    results: allUsers.length,
    data: {
      allUsers
    }
  });
});

//! Update user details while logged in
exports.updateMe = catchAsync(async (Request, Response, next) => {
  //Create error if user post password Data
  if (Request.body.password || Request.body.passwordConfirm) {
    return next(
      new AppError(
        'This Route is not for password update. please use updateMyPassword Route',
        400
      )
    );
  }

  //filtered out unwanted fieds name that not allowed to update
  const filteredBody = filterObj(Request.body, 'name', 'email');

  //Update User Document
  const updatedUser = await User.findByIdAndUpdate(
    Request.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );
  Response.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

//! Delete(deactivate) user while logged in
exports.deleteMe = catchAsync(async (Request, Response, next) => {
  await User.findByIdAndUpdate(Request.user.id, { active: false });
  Response.status(204).json({
    status: 'success',
    data: null
  });
});

//! create new User By admin
exports.createNewUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

//! Get single user by Id
exports.getSingleUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

//! Update user deatils as Admin
exports.patchUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

//! Delete User as Admin
exports.deleteUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};
