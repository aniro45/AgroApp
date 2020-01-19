const fs = require('fs');

const agroJsonData = fs.readFileSync(`${__dirname}/agroData.json`, 'utf-8');

const parsedAgroJsonData = JSON.parse(agroJsonData);

exports.addComponentScript = () => {
  let i = 0;
  while (i < parsedAgroJsonData.lenght)
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
};

// const addComponentScript = require(`${__dirname}/devData/data/addToJsonScript.js`);
// addComponentScript.addComponentScript;
