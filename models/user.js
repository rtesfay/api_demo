const config = require('../config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    select: false,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({
    id: this._id,
  }, config['jwtPrivateKey']);

  return token;
}

userSchema.methods.passwordVerified = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, success) {
      return resolve(success ? true : false);
    });
  });
}

module.exports = mongoose.model('User', userSchema);