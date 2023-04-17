const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const InaccurateDataError = require('../errors/InaccurateDataError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/userSchema');
const { JWT_SECRET } = require('../utils/config');

const { NODE_ENV } = process.env;

// POST /signin ---- Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError('Неправильные почта или пароль')))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        throw new UnauthorizedError('Неправильные почта или пароль');
      }))
    .then((user) => {
      const token = jsonwebtoken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ _id: user._id, token });
    })
    .catch(next);
};

// POST /signup ---- Регистрация
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  // Хешировать пороль
  bcrypt.hash(password, 10)
    // Создать пользователся
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        email,
        name,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  login,
  createUser,
};
