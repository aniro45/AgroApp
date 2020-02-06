//Review //rating //createdAt //ref to Tour //ref to user

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String
    },
    rating: {
      type: Number,
      default: null,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'produxes',
      required: [true, 'Review must belong to Product']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'usex',
      required: [true, 'Review must belong to User']
    }
  },

  //virtual properties
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Populate for Parenting or parenting normalization
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'product',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  // next();

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
