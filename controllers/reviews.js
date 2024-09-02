const Review = require('../models/review.js');
const Campground = require('../models/campground.js');

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Review created successfully!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReviews = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Deleted review successfully!');
  res.redirect(`/campgrounds/${id}`);
};
