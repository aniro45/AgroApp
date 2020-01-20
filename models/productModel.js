const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    unique: true
  },
  component: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'Pesticide'
  },
  description: {
    type: String,
    required: false
  }
});

const Products = mongoose.model('Products', ProductSchema);
module.exports = Products;
