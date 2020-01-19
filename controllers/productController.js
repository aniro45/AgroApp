const fs = require('fs');

const readJosnFile = fs.readFileSync(
  `${__dirname}/../devData/data/agroData.json`,
  'utf-8'
);
const parsedAgroJsonData = JSON.parse(readJosnFile);

exports.checkId = (Request, Response, next, val) => {
  console.log('product id is ' + val);
  if (Request.params.id * 1 > parsedAgroJsonData.length) {
    return Response.status(404).json({
      status: 'Failed',
      data: {
        message: 'Invalid ID'
      }
    });
  }
  next();
};

exports.checkBody = (Request, Response, next) => {
  if (!Request.body.product || !Request.body.company) {
    console.log('Data is Invalid');
    return Response.status(400).json({
      status: 'Failed',
      data: {
        message: 'product name or Company name is not defined!'
      }
    });
  }
  next();
};

//! Get All Products
exports.getAllproducts = (Request, Response) => {
  Response.status(200).json({
    Status: 'Successfull',
    RequestedAt: Request.requestTime,
    results: parsedAgroJsonData.length,
    data: {
      FileData: parsedAgroJsonData
    }
  });
};

//! Create New Product

exports.createNewProduct = (Request, Response) => {
  const data = Request.body;

  const newId = parsedAgroJsonData[parsedAgroJsonData.length - 1].id + 1;

  const newProduct = Object.assign({ id: newId }, Request.body);
  parsedAgroJsonData.push(newProduct);

  fs.writeFile(
    `${__dirname}/../devData/data/agroData.json`,
    JSON.stringify(parsedAgroJsonData),
    error => {
      Response.status(201).json({
        Status: 'Successfull',
        RequestedAt: Request.requestTime,
        results: parsedAgroJsonData.length,
        data: {
          FileData: newProduct
        }
      });
    }
  );
};

//! Get Single Product By ID

exports.getProduct = (Request, Response) => {
  const id = Request.params.id * 1;

  const getProduct = parsedAgroJsonData.find(el => el.id === id);

  Response.status(404).json({
    message: 'Success',
    RequestedAt: Request.requestTime,
    data: {
      product: getProductcc
    }
  });
};

//! update the Patch for the Product

exports.patchProduct = (Request, Response) => {
  const id = Request.params.id * 1;
  const getProduct = parsedAgroJsonData.find(el => el.id === id);

  Response.status(404).json({
    message: 'Patched Success',
    RequestedAt: Request.requestTime,
    data: {
      product: '<update patch updated>'
    }
  });
};

//! Delete Product By id

exports.deleteProduct = (Request, Response) => {
  const id = Request.params.id;
  const getProduct = parsedAgroJsonData.find(el => el.id === id);

  Response.status(404).json({
    message: 'Delete Success',
    RequestedAt: Request.requestTime,
    data: {
      product: null
    }
  });
};
