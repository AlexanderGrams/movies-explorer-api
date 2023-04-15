const Movie = require('../models/movieSchema');
const InaccurateDataError = require('../errors/InaccurateDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// GET /movies ---- Получить все фильмы добавленные авторизированным пользователем
const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .populate('owner')
    .then((movie) => res.send(movie))
    .catch(next);
};

// POST /movies ---- Создать фильм
const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  // Создать новый фильм в базе данных
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => res.status(201).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return (err);
    });
};

// DELETE /movies/:_id ---- Удалить фильм
const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;

  // Найти и удалить фильм по id в базе данных
  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw next(new NotFoundError('Фильм не найден'));
      }
      if (userId !== String(movie.owner)) {
        throw next(new ForbiddenError('Нет прав для удаления этого фильма'));
      }
      return movie.deleteOne();
    })
    .then((deletedMovie) => {
      res.send({ deletedMovie });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovie,
};
