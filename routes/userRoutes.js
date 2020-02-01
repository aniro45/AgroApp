const express = require('express');
const userController = require(`${__dirname}/../controllers/userController.js`);
const authController = require(`${__dirname}/../controllers/authController.js`);

const router = express.Router();

//! Signin Login Route
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//! Forgot password related Route
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//! Route to handle operations while user is logged in
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

//! Basic Routes
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
