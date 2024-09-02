const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

const userController = require('../controllers/users');

router.get('/register', userController.renderRegisterForm);

router.post('/register', catchAsync(userController.register));

router.get('/login', userController.renderLogin);

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  userController.login,
);

router.get('/logout', userController.logout);

module.exports = router;
