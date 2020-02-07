const Products = require(`${__dirname}/../models/productModel.js`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/handlerFactory`);

//! This filters data and select only required data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//! Get Self Data While Logged in
exports.getMe = (Request, Response, next) => {
  Request.params.id = Request.user.id;
  next();
};

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

//! create User As Admin
exports.createNewUser = catchAsync(async (Request, Response, next) => {
  Response.status(204).json({
    status: 'This Route is not yet Defined! please use /signUp instead!',
    data: null
  });
});

//! This Gives all Users from database
exports.getAllUsers = factory.getAll(User);

//! Get single user by Id
exports.getUser = factory.getOne(User);

//! Update user deatils as Admin
exports.patchUser = factory.updateOne(User);

//! Delete User as Admin
exports.deleteUser = factory.deleteOne(User);
