const express = require('express');

// mergeParams will allow params from the app.js to be passed to the routes in this file
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../middleware.js');

const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review successfully!');
    res.redirect(`/campgrounds/${id}`);
  }),
);

module.exports = router;
