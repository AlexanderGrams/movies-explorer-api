const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  login, createUser,
} = require('../controllers/availabilityControllers');

// Авторизация
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

// Регистрация
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

module.exports = router;
