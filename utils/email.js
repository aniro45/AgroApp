const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //Activate in Gmail "less secure app" Option
  });

  //Define the emailoption
  const mailOptions = {
    from: 'Aniket Jadhav <aniket.jadhav.8151@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    //html:
  };

  //Actually the send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
