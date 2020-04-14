const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'produxes',
    required: [true, 'booking must belong to product'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'usex',
    required: [true, 'booking must belong to user'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'product',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
