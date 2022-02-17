const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { DEV_JWT_KEY } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotAuthError = require('../errors/NotAuthError');

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.status(200).send(user);
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;
        return Promise.reject(err);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // хеши не совпали — отклоняем промис
          const err = new Error('Неправильные почта или пароль');
          err.statusCode = 401;
          return Promise.reject(err);
        }
        // аутентификация успешна
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_KEY);
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          sameSite: true,
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
      res.status(200).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
      if (err.code === 11000) {
        throw new ConflictError(err.message);
      }
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
