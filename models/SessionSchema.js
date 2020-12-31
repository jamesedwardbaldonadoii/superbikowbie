const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BaseSchema = require('./BaseSchema')
const { Rule, validator } = require('../lib')

const SessionSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  refreshToken: {
    type: String,
    required: true,
    validation: new Rule({
      validator: v => validator.isUuid(v),
      description: 'string; UUID;'
    })
  },
  fingerprint: {
    type: String,
    required: true,
    validation: new Rule({ // https://github.com/Valve/fingerprintjs2
      validator: v => (typeof v === 'string') && v.length >= 10 && v.length <= 50,
      description: 'string; min 10; max 50 chars;'
    })
  },
  ua: {
    type: Object,
    required: true
  },
  ip: {
    type: String,
    required: false
  },
  expiredAt: {
    type: Date,
    required: false
  },
  ...BaseSchema
})

module.exports = SessionSchema
