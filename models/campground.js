const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  author: {
    type: String,
  },
  location: {
    type: String,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
});

module.exports = mongoose.model('Campground', CampgroundSchema);
