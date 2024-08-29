module.exports.isLoggedIn = (req, res, next) => {
  // The method isAuthenticated is added by passport to the request
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in to perform this action!');
    return res.redirect('/login');
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
