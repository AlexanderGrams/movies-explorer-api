const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const availabilityRoutes = require('./availability');
const auth = require('../middlewares/auth');

// Все доступные роуты страницы без авторизации
router.use('/', availabilityRoutes);

// Проверка авторизации
router.use(auth);

// Все доступные роуты страницы с авторизацией
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

// // обработка ошибки, если введен несуществующий URL
router.use((req, res, next) => next(new NotFoundError('Такого URL не существует')));

module.exports = router;
