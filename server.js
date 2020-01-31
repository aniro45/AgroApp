const mongoose = require('mongoose');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', error => {
    console.log('Uncaught Exception! Shutting Down...');
    console.log(error.name, error.message);
    process.exit(1);
  });
}

dotenv.config({ path: './config.env' });
const app = require(`${__dirname}/app.js`);

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
      process.env.DATABASE_ONLINE.replace('<PASSWORD>', process.env.DB_PASSWORD)
    ) {
      console.log('CONNECTED TO ONLINE AgroApp DATABASE.');
    } else {
      console.log('CONNECTED TO OFFLINE AgroApp DATABASE.');
    }
  });

//! SERVER CODE
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(
    `Server is Running in ${process.env.NODE_ENV.toUpperCase()} mode on port ${port}...`
  );
});

if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', error => {
    console.log(error.name, error.message);
    console.log('UNdandler Rejection! Shutting Down...');
    server.close(() => {
      process.exit(1);
    });
  });
}
