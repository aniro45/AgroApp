const express = require('express');
const userController = require(`${__dirname}/../controllers/userController.js`);

const router = express.Router();

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
