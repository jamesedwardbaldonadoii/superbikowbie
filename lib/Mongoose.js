const mongoose = require('mongoose')
const { Assert: assert } = require('./assert')

class Mongoose {
  constructor ({ mongoUriDb, schemas, logger }) {
    assert.object(schemas, { required: true, notEmpty: true })
    assert.string(mongoUriDb, { required: true, notEmpty: true })

    logger.info('MongoDb start initialization...')
    return start({ mongoUriDb, schemas, logger })
  }
}

function start ({ mongoUriDb, schemas, logger }) {
  mongoose.Promise = global.Promise

  const db = mongoose
    .set('useCreateIndex', true)
    .connect(mongoUriDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

  Object.keys(schemas).forEach(schema => {
    mongoose.model(schema, require(`../models/${schemas[schema]}`))
  })

  return db
}

module.exports = { Mongoose }
