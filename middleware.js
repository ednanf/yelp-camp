// The method isAuthenticated is added by passport to the request
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to perform this action!');
    return res.redirect('/login');
  }
  next();
};
