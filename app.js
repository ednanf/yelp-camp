if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverried = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');

const User = require('./models/user.js');

const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');

const app = express();

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
app.use(flash());

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

// Passport middleware (must come *after* express-session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom middleware to make flash message contents available in all templates and more
app.use((req, res, next) => {
  // res.locals gives global access
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

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
