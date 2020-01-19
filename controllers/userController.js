const fs = require('fs');

const readJosnFile = fs.readFileSync(
  `${__dirname}/../devData/data/userData.json`,
  'utf-8'
);

exports.getAllUsers = (Request, Response) => {
  Response.status(500).json({
    status: 'error',
    message: 'This User route is not yet defined!'
  });
};

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
