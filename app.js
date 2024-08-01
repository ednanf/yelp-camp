const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');

const app = express();

// Mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// Middleware
app.engine('ejs', ejsMate); // change the default ejs engine
app.set('view engine', 'ejs'); // tells the engine used should be for ejs
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
  }),
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  }),
);

app.put(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  }),
);

app.use((err, req, res, next) => {
  res.send('Oh boy! Something went wrong!');
});

// Start the server
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
