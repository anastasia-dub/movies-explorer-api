const router = require('express').Router();

const {
  validateLogin,
  validateSignup,
} = require('../middlewares/validationRequest');

const {
  login,
  logout,
  createUser,
} = require('../controllers/users');

const { NOT_FOUND_ERROR } = require('../utils/constants');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validateLogin, login);
router.post('/signup', validateSignup, createUser);
router.post('/signout', logout);

router.use(auth, userRouter);
router.use(auth, movieRouter);

router.use('/*', () => {
  throw new NotFoundError(NOT_FOUND_ERROR);
});

module.exports = router;
