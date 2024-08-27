const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverried = require('method-override');
const ejsMate = require('ejs-mate');
const dotenv = require('dotenv');

const ExpressError = require('./utils/ExpressError');

const campgroundsRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');

const app = express();
dotenv.config();

// Mongoose connection
const URI = process.env.DB_URI;

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverried('_method'));

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: Date.now() + 1000 * 60 * 60 * 24,
  },
};
app.use(session(sessionConfig));

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

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
