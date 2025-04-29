const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email:{type: String, required: true, unique: true},
  password:{type: String, required: true},
});

const LoginModel = mongoose.model( 'Login', LoginSchema);

module.exports = LoginModel;