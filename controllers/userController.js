const Products = require(`${__dirname}/../models/productModel.js`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const User = require(`${__dirname}/../models/userModel`);

// const readJosnFile = fs.readFileSync(
//   `${__dirname}/../devData/data/userData.json`,
//   'utf-8'
// );

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

exports.createNewUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

exports.getSingleUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

exports.patchUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

exports.deleteUser = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};
