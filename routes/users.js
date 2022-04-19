const userRouter = require('express').Router();

const {
  validateId,
  validateCurrentUserUpdate,
} = require('../middlewares/validationRequest');

const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/users');

userRouter.get('/users/me', validateId, getCurrentUser);
userRouter.patch('/users/me', validateCurrentUserUpdate, updateCurrentUser);

module.exports = userRouter;
