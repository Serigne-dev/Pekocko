const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // pour qu'il n'y ai pas 2 adresses mail identiques

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);