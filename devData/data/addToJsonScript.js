const fs = require('fs');

const agroJsonData = fs.readFileSync(`${__dirname}/agroData.json`, 'utf-8');

const parsedAgroJsonData = JSON.parse(agroJsonData);

exports.addComponentScript = () => {
  let i = 0;
  while (i < parsedAgroJsonData.length) {
    parsedAgroJsonData.find(el => {
      if (!el.price) {
        const newProduct = Object.assign({ price: 150 }, parsedAgroJsonData.el);
        parsedAgroJsonData.push(newProduct);

        fs.writeFile(
          `${__dirname}/agroData.json`,
          JSON.stringify(parsedAgroJsonData),
          error => {
            console.log('data Added Successfully!');
          }
        );
        console.log('Added Data Successfully!');
      } else {
        console.log('Data has already Added!');
      }
    });
    i++;
  }
};


//create product with File System And assign data. 
const assignIdToJson = () => {
  const readJosnFile = fs.readFileSync(
    `${__dirname}/../devData/data/agroData.json`,
    'utf-8'
  );
  const parsedAgroJsonData = JSON.parse(readJosnFile);

  const data = Request.body;

  const newId = parsedAgroJsonData[parsedAgroJsonData.length - 1].id + 1;

  const newProduct = Object.assign({ id: newId }, Request.body);
  parsedAgroJsonData.push(newProduct);

  fs.writeFile(
    `${__dirname}/../devData/data/agroData.json`,
    JSON.stringify(parsedAgroJsonData),
    error => {
      console.log(error);
    }
  );
};

const getElementById = () => {
  const id = Request.params.id * 1;

  const getProduct = parsedAgroJsonData.find(el => el.id === id);
};

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

// const addComponentScript = require(`${__dirname}/devData/data/addToJsonScript.js`);
// addComponentScript.addComponentScript;
