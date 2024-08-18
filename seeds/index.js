const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// Dotenv config
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// Get a random image in Unsplash.com
async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,
        collections: 'PHh1QTPf2ts',
        count: 30,
      },
    });

    // returns an array with 30 images (maximum allowed)
    return resp.data.map((a) => a.urls.regular);
  } catch (err) {
    console.error(err);
  }
}

// Generate a random number
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed the database
const seedDB = async () => {
  await Campground.deleteMany({});
  const imgs = await seedImg();

  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: '66b747e22dd3cd7317ae1a05',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: sample(imgs), // get a random image from the array 'imgs'
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia adipisci suscipit corporis ab pariatur dolores eius quos reiciendis nisi. Sunt maxime eius natus alias dicta fugit qui voluptate necessitatibus cupiditate?',
      price: price,
    });
    await camp.save();
  }
};

// Close the database connection
seedDB().then(() => {
  mongoose.connection.close();
});
