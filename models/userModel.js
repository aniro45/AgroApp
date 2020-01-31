const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please must Provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please must provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide Password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please Confrim your password'],
    validate: {
      //They Only works on CREATE & SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'passwords are not the same!'
    }
  },
  passwordChangedAt: {
    type: Date,
    required: true
  }
});4

userSchema.pre('save', async function(next) {
  //only run this function if the pssword is difined
  if (!this.isModified('password')) return next();

  //hash the pass with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete pass confrom field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }
  //False means NOT changed
  return false;
};

const User = mongoose.model('usex', userSchema);
module.exports = User;
