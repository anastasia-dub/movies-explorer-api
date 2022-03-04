const jwt = require('jsonwebtoken');
const { DEV_JWT_KEY, NOT_AUTH_ERROR } = require('../utils/constants');
const NotAuthError = require('../errors/NotAuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new NotAuthError(NOT_AUTH_ERROR);
  }

  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_KEY);
    req.user = payload;

    next();
  } catch (err) {
    err.statusCode = 401;
    next(new NotAuthError(NOT_AUTH_ERROR));
  }
};

module.exports = auth;
