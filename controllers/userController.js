const multer = require('multer');
// const sharp = require('sharp');
// const Products = require(`${__dirname}/../models/productModel.js`);

// const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/handlerFactory`);

//! Multer All Related
const multerStorage = multer.diskStorage({
  destination: (Request, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (Request, file, cb) => {
    // useer-65463694abc5464-6548946646.jpeg
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${Request.user.id}-${Date.now()}.${ext}`);
  }
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (Request, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadUserPhoto = upload.single('photo');

//! Sharp Library for Image Procsessing
// exports.resizeUserPhoto = (Request, Response, next) => {
//   Request.file.filename = `user-${Request.user.id}-${Date.now()}.jpeg`;
//   if (!Request.file) return next();
//   sharp(Request.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${Request.file.filename}`);
//   next();
// };

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
  if (Request.file) filteredBody.photo = Request.file.filename;
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
