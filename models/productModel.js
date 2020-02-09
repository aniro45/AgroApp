const mongoose = require('mongoose');
const sligify = require('slugify');
const validator = require('validator');
const User = require(`${__dirname}/userModel`);

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
      // validate: [
      //   validator.isAlpha,
      //   // validator.matches(/^[a-zA-Z]+$/i),
      //   // input.split(' ').every(function(word) {
      //   //   return isAlpha(word);
      //   // }),
      //   'A product name should only containt charachter'
      // ]
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to current doc on NEW document creation.
          return val < this.price;
        },
        message: 'price discount must be less than price'
      }
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
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be Atleat 1.0'],
      max: [5, 'rating must be Atmost 5.0'],
      set: val => Math.round(val * 10) / 10 //4.6666, 4.7 47 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
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
    },
    sellerLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String
    },
    // sellers: Array //Embedding
    sellers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'usex'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Indexing and complext schema Apply
ProductSchema.index({ name: 1, weight: 1 }, { unique: true });

ProductSchema.index({ price: 1, ratingsAverage: -1 });

//Virtual Properties
ProductSchema.virtual('unit').get(function() {
  return this.weight * 1000;
});

//virtual Populate
ProductSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'product',
  localField: '_id'
});

//Document Middleware
ProductSchema.pre('save', function(next) {
  this.slug = sligify(this.name, { lower: true });
  next();
});

//Embedding
// ProductSchema.pre('save', async function(next) {
//   const sellersPromises = this.sellers.map(async id => await User.findById(id));
//   this.sellers = await Promise.all(sellersPromises);
//   next();
// });

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

//populate or child normilization
ProductSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sellers',
    select: '-__v -passwordChangedAt'
  });
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
