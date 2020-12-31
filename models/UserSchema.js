const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');
const validator = require('validator');

// Create Schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: false
  },
  suffix: {
    type: String
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate (value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    }
  },
  role: {
    type: String,
    default: 'user',
    enum: ['superadmin', 'user']
  },
  provider: {
    type: String,
    trim: true,
    default: 'local',
    enum: ['local', 'fingerprint']
  },
  providerId: {
    type: String,
    trim: true
  },
  ...BaseSchema
});

UserSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname} ${this.suffix ? this.suffix : ''}`;
});

UserSchema.methods.getPublicFields = function () {
  var returnObject = {
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    username: this.username,
    suffix: this.suffix,
    role: this.role
  };

  return returnObject;
};

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = UserSchema;
