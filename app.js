const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverried = require('method-override');
const ejsMate = require('ejs-mate');

const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const Campground = require('./models/campground');
const Review = require('./models/review');

const app = express();
const URI =
  'mongodb://127.0.0.1:27017/yelp-camp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.15';

// Mongoose connection
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('********** Connected to Local MongoDB');
});

// EJS configuration
app.engine('ejs', ejsMate); // package to help with boilerplate.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverried('_method'));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

// Campground routes
app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  }),
);

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/details', { campground });
  }),
);

app.post(
  '/campgrounds',
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  }),
);

app.put(
  '/campgrounds/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  }),
);

// Reviews routes
app.post(
  '/campgrounds/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

app.delete(
  '/campgrounds/:id/reviews/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }),
);

// Error handling
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found!'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no! Something went wrong!';
  res.status(statusCode).render('error', { err });
});

// Server start
app.listen(3000, () => {
  console.log('********** Server started on port 3000');
});
