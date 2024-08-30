const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');

const Review = require('./review');

const Schema = mongoose.Schema;

// Schema.Types.ObjectId should use .populate() to fill in the data.

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

// Middleware

// Post middleware - will run **after** the condition is met
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model('Campground', CampgroundSchema);
