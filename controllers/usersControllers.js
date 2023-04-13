const InaccurateDataError = require('../errors/InaccurateDataError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/userSchema');

function searchingUser(res, next, id) {
  return User.findById(id)
    .then((user) => {
      if (!(user)) {
        throw next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

// GET users/me ---- Получить информацию об авторизированном пользователе
const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  return searchingUser(res, next, _id);
};

function updateInfo(res, next, id, propertiesObj) {
  User.findByIdAndUpdate(id, propertiesObj, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

// PATCH users/me ---- изменить информацию авторизированного пользователя
const patchUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return updateInfo(res, next, userId, { name, about });
};

module.exports = {
  getUserInfo,
  patchUserInfo,
};
