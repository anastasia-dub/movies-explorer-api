const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  DEV_JWT_KEY,
  NOT_AUTH_ERROR_WRONG_EMAIL_PASSWORD,
  VALIDATION_ERROR_NAME,
  BAD_REQUEST,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotAuthError = require('../errors/NotAuthError');

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    })
    .catch(next);
};

const updateCurrentUser = (req, res, next) => {
  const id = req.user._id;
  const newName = req.body.name;
  const newEmail = req.body.email;

  User.findOneAndUpdate(
    { _id: id },
    { name: newName, email: newEmail },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        throw new BadRequestError(BAD_REQUEST);
      }
      throw err;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error(NOT_AUTH_ERROR_WRONG_EMAIL_PASSWORD);
        err.statusCode = 401;
        return Promise.reject(err);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // хеши не совпали — отклоняем промис
          const err = new Error(NOT_AUTH_ERROR_WRONG_EMAIL_PASSWORD);
          err.statusCode = 401;
          return Promise.reject(err);
        }
        // аутентификация успешна
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_KEY);
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
        res.send({ _id: user._id });
        return null;
      });
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send();
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        throw new BadRequestError(BAD_REQUEST);
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  login,
  logout,
  createUser,
};
