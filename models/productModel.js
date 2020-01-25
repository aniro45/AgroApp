const mongoose = require('mongoose');
const sligify = require('slugify');

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

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have name'],
      trim: true,
      minlength: [3, 'A product name must have atleast 3 charachters'],
      maxlength: [30, 'A product name must have atmost 30 charachters']
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
      required: [true, 'A product must have form'],
      enum: {
        values: ['solid', 'liquid'],
        message: 'form should be either solid or liquid'
      }
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
      required: false,
      min: [1, 'rating must be Atleat 1.0'],
      max: [5, 'rating must be Atmost 5.0']
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    slug: String,
    privateProduct: {
      type: Boolean,
      dafault: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Indexing and complext schema Apply
ProductSchema.index({ name: 1, weight: 1 }, { unique: true });

//Virtual Properties
ProductSchema.virtual('unit').get(function() {
  return this.weight * 1000;
});

//Document Middleware
ProductSchema.pre('save', function(next) {
  this.slug = sligify(this.name, { lower: true });
  next();
});

// ProductSchema.pre('save', function(next) {
//   console.log('will save the document....');
//   next();
// });

// ProductSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware
// ProductSchema.pre('find', function(next) {
ProductSchema.pre(/^find/, function(next) {
  //reguler expression for "find" to cover "findOne"
  this.find({ privateProduct: { $ne: true } });
  this.start = Date.now();
  next();
});

ProductSchema.post(/^find/, function(docs, next) {
  console.log(`query took ${Date.now() - this.start} millisecond`);
  next();
});

//Aggrgation Middleware
ProductSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { privateProduct: { $ne: true } } });
  console.log(this.pipeline);
  next();
});

//Creating Model for ProductSchema
const Products = mongoose.model('produxes', ProductSchema);
module.exports = Products;
