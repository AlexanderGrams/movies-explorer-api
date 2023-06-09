const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'Поле "email" должно быть валидным email-адресом',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
