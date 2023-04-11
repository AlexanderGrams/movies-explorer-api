const express = require('express');
const mongoose = require('mongoose');

const { PORT, DB_ADDRESS } = require('./config');

const app = express();

// Подключение к базе данных
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

// Парсинг приходящих данных со стороны клиента
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Подключение к базе данных
app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`Серевер запущен на - ${PORT} порту`);
});
