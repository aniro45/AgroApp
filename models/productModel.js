const mongoose = require('mongoose');

const Xenum = [];

const onDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  quantiyArrived: {
    type: Number,
    required: false
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have name'],
    trim: true
  },
  component: {
    type: String,
    required: [true, 'A tour must have product component']
  },
  weight: {
    type: Number,
    required: [true, 'A product must have weight']
  },
  company: {
    type: String,
    required: [true, 'A product must have company'],
    trim: true
  },
  totalQuantity: {
    type: Number,
    required: [true, 'A product must have total quantity']
  },
  type: {
    type: String,
    default: 'Pesticide',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'A tour must have a category'],
    trim: true
  },
  form: {
    type: String,
    enum: ['solid', 'liquid'],
    required: [true, 'A product must have form']
  },
  price: {
    type: Number,
    required: [true, 'A product must have price']
  },
  onDate: {
    type: onDateSchema
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have cover Image']
  },
  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  rating: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false,
    trim: true
  }
});

// ProductSchema.index({ name: 1, weight: 1, description: 1 }, { unique: true });

ProductSchema.index({ name: 1, weight: 1 }, { unique: true });
const Products = mongoose.model('produxes', ProductSchema);
module.exports = Products;
