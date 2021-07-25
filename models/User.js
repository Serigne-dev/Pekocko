const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package de validation des infoss avant de les enregistrer

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique pour qu'il n'y ai pas de @ identiques
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);