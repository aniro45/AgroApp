const express = require('express');
const multer = require('multer');
const userController = require(`${__dirname}/../controllers/userController.js`);
const authController = require(`${__dirname}/../controllers/authController.js`);
const reviewController = require(`${__dirname}/../controllers/reviewController`);

const router = express.Router();

//! Signin Login Route
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

//! Forgot password related Route
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//This middle ware Run before every routes from below!
router.use(authController.protect);

//! Route to handle operations while user is logged in
router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

//This middle ware Run before every routes from below!
router.use(authController.restrictTo('admin'));
//! Basic Routes
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
