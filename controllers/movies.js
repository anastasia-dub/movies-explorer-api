const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  NOT_FOUND_MOVIE_ERROR,
  FORBIDDEN_DELETE_MOVIE_MESSAGE,
  VALIDATION_ERROR_NAME,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(201).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        throw new BadRequestError(err.message);
      } else if (err.code === 11000) {
        throw new ConflictError(err.message);
      }
      throw err;
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_MOVIE_ERROR);
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError(FORBIDDEN_DELETE_MOVIE_MESSAGE);
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((deletedMovie) => {
            res.send({ data: deletedMovie });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
