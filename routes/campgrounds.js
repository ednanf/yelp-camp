const express = require('express');
const router = express.Router();

// File upload middleware
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

const catchAsync = require('../utils/catchAsync');

const campgroundControllers = require('../controllers/campgrounds');

router
  .route('/')
  .get(catchAsync(campgroundControllers.index))
  // .post(isLoggedIn, validateCampground, catchAsync(campgroundControllers.createCampground))
  .post(upload.single('image'), (req, res) => {
    console.log(req.body, req.file);
    res.send('It worked?!');
  });

router.get('/new', isLoggedIn, campgroundControllers.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgroundControllers.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundControllers.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundControllers.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundControllers.renderEditForm));

module.exports = router;
