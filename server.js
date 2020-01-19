const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require(`${__dirname}/app.js`);

const addComponentScript = require(`${__dirname}/devData/data/addToJsonScript.js`);

addComponentScript.addComponentScript;

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
  console.log('Check Internet Connection or Error Log for More Info!');
}

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  component: {
    type: String,
    required: true
  }
});

const product = mongoose.model('product', productSchema);

//! SERVER CODE
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is Running on port ${port}...`);
});
