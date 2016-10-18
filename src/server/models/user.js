const mongoose = require('../db');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId      : { type: String, index: true },
    name        : String,
    email       : String,
    photo       : String
});

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;