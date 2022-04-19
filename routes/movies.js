const movieRouter = require('express').Router();

const {
  validateMovieCreate,
  validateMovieDelete,
} = require('../middlewares/validationRequest');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateMovieCreate, createMovie);
movieRouter.delete('/movies/:movieId', validateMovieDelete, deleteMovie);

module.exports = movieRouter;
