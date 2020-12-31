const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BaseSchema = require('./BaseSchema')
const { Rule, validator } = require('../lib')

// Create Schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    form: 'text',
    maxlength: 100,
    validation: new Rule({
      validator: v => typeof v === 'string',
      description: 'string;'
    })
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    form: 'text',
    validation: new Rule({
      validator: v => typeof v === 'string',
      description: 'string;'
    })
  },
  email: {
    type: String,
    unique: true,
    form: 'email',
    required: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email address.', /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.toString()],
    validation: new Rule({
      validator: e => validator.isEmail(e),
      description: 'string;'
    })
  },
  username: {
    type: String,
    unique: true,
    form: 'text',
    required: false,
    validation: new Rule({
      validator: v => typeof v === 'string',
      description: 'string;'
    })
  },
  suffix: {
    type: String,
    form: 'enum',
    placeholder: 'Select Suffix',
    enum: ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV'],
    validation: new Rule({
      validator: p => ['I', 'II', 'Jr.', 'Sr.', 'III'].indexOf(p) > -1,
      description: 'value enum missing'
    })
  },
  password: {
    type: String,
    form: 'password',
    minlength: 7,
    maxlength: 100,
    required: true,
    validate: [
      p => p && p.length > 6,
      'Password should be longer'
    ],
    validation: new Rule({
      validator: p => typeof p === 'string' && p.length > 6,
      description: 'string; min 7 characters'
    })
  },
  role: {
    type: String,
    form: 'enum',
    default: 'user',
    placeholder: 'Select Employee Role',
    enum: ['superadmin', 'user'],
    validation: new Rule({
      validator: p => ['superadmin', 'user'].indexOf(p) > -1,
      description: 'value enum missing'
    })
  },
  provider: {
    type: String,
    form: 'text',
    default: 'local',
    enum: ['local', 'fingerprint'],
    validation: new Rule({
      validator: p => ['local', 'fingerprint'].indexOf(p) > -1,
      description: 'value enum missing'
    })
  },
  providerId: {
    form: 'text',
    type: String
  },
  ...BaseSchema
})

UserSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname} ${this.suffix ? this.suffix : ''}`
})

UserSchema.methods.getPublicFields = function () {
  var returnObject = {
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    username: this.username,
    suffix: this.suffix,
    role: this.role
  }

  return returnObject
}

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

module.exports = UserSchema
