const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

const userController = require('../controllers/users');

router.route('/register').get(userController.renderRegisterForm).post(catchAsync(userController.register));

router
  .route('/login')
  .get(userController.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    userController.login,
  );

router.get('/logout', userController.logout);

module.exports = router;
