const express = require('express');
const router = express.Router();

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

const catchAsync = require('../utils/catchAsync');

const campgroundControllers = require('../controllers/campgrounds');

router.get('/', catchAsync(campgroundControllers.index));

router.get('/new', isLoggedIn, campgroundControllers.renderNewForm);
router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundControllers.createCampground));

router.get('/:id', catchAsync(campgroundControllers.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundControllers.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundControllers.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundControllers.deleteCampground));

module.exports = router;
