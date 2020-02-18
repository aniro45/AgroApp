const fs = require('fs');
const Products = require(`${__dirname}/../../models/productModel.js`);
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './../../config.env' });
// const app = require(`${__dirname}/../../app.js`);

// const addComponentScript = require(`${__dirname}/devData/data/addToJsonScript.js`);

// addComponentScript.addComponentScript;

//! ONLINE DATABASE CONNECTION STRING.
const DB = process.env.DATABASE_ONLINE.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

//! LOCAL OFFLINE DATABASE CONNECTION STRING.
// const DB = process.env.DATABASE_OFFLINE;

//! MONGOOSE FUNCTION TO CONNECT DATABASE
try {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(con => {
      if (
        DB ===
        process.env.DATABASE_ONLINE.replace(
          '<PASSWORD>',
          process.env.DB_PASSWORD
        )
      ) {
        console.log('CONNECTED TO ONLINE AgroApp DATABASE.');
      } else {
        console.log('CONNECTED TO OFFLINE AgroApp DATABASE.');
      }
    });
} catch (error) {
  console.log('Check, Internet Connection or Error Log for More Info!' + error);
}

//! Add Data to database from local file System
const sendDataToMongodb = async (Request, Response) => {
  try {
    const readedFile = JSON.parse(
      fs.readFileSync(`${__dirname}/../data/productsData.json`, 'utf-8')
    );
    await Products.create(readedFile);
    console.log('data EXPORTED successfully to mongoDB database!');
  } catch (error) {
    console.log('problem Loading Data...' + error);
  }
};

//! Delete all data from the ONLINE database
const deleteDataFromMongodb = async (Request, Response) => {
  try {
    await Products.deleteMany();
    console.log('data DELETED successfully to mongoDB database!');
  } catch (error) {
    console.log('Problem Deleting Data...' + error);
  }
};

// console.log(process.argv);

if (process.argv[2] === '--import') {
  sendDataToMongodb();
} else if (process.argv[2] === '--delete') {
  deleteDataFromMongodb();
} else {
  console.log('Operation Fialed!');
}

//COMMANDS
// node exportDataOnline.js --import
// node exportDataOnline.js --delete
