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
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
