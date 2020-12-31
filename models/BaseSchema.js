const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = {
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}
