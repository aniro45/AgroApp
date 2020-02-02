const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//! Schema Genartion for 'user' collection
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
  role: {
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user'
  },
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
    default: Date.now()
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});
4;

//! This middleware run before every password change for encryption
userSchema.pre('save', async function(next) {
  //only run this function if the pssword is difined
  if (!this.isModified('password')) return next();

  //hash the pass with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete pass confrom field
  this.passwordConfirm = undefined;
  next();
});

//! This middleware run before every password chage for update time
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//! This checks if user is deactivated
userSchema.pre(/^find/, function(next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});

//! This checks if the user password equals to DB password
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//! This middleware run after every password chage for token expiry
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

//! To create password Reset Token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetExpires);
  return resetToken;
};

//! Model for the UserSchema
const User = mongoose.model('usex', userSchema);
module.exports = User;
