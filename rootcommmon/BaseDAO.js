const mongoose = require('mongoose')
const moment = require('moment')

const errorCodes = require('../lib/errorCodes')
const { AppError } = require('../lib/AppError')
const { Assert: assert } = require('../lib/assert')

class BaseDAO {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorEmptyResponse () {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'DAO' })
  }

  static emptyPageResponse () {
    return { results: [], total: 0 }
  }

  static emptyListResponse () {
    return []
  }

  static emptyObjectResponse () {
    return {}
  }

  static query () {
    return mongoose.model(this.model)
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static async baseCreate (entity = {}) {
    assert.object(entity, { required: true })

    const data = await this.query()(entity).save()

    if (!data) throw this.errorEmptyResponse()

    return data
  }

  static async baseUpdate (id, entity = {}) {
    assert.id(id, { required: true })
    assert.object(entity, { required: true })

    const data = await this.query()
      .findByIdAndUpdate(id, entity, { new: true })
      .select(Object.keys(entity).join(' '))

    if (!data) throw this.errorEmptyResponse()

    return data
  }

  static async baseBulkUpdate ({ id, payload } = {}) {
    assert.array(id, { required: true })
    assert.object(payload, { required: true })

    const data = await this.query()
      .update({ _id: { $in: id } },
        { $set: payload },
        { multi: true })
      .select(Object.keys(payload).join(' '))
    console.log(data)
    if (!data) throw this.errorEmptyResponse()

    return data
  }

  static async baseGetList ({ page, limit, filter, orderBy, fields, search, searchFields } = {}) {
    assert.integer(page, { required: true })
    assert.integer(limit, { required: true })
    assert.object(filter, { required: true })
    assert.string(fields, { required: false })

    if (!filter) filter = {}

    if (searchFields && search) {
      const fieldsToFilter = searchFields.split(',')

      if (!filter['$and']) {
        filter['$and'] = []
      }

      const searchCondition = {
        $or: []
      }

      fieldsToFilter.forEach(i => {
        if (i) {
          searchCondition.$or.push({
            [i]: {
              $regex: search,
              $options: 'i'
            }
          })
        }
      })

      filter['$and'].push(searchCondition)
    }

    filter.deletedAt = null
    filter.deletedBy = null

    const data = await this.query()
      .find(filter)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort(orderBy)
      .select(fields)
      .exec()

    const total = await this.query().countDocuments(filter).exec()

    return { data, total }
  }

  static async baseGetCount (filter = {}) {
    assert.object(filter, { required: true })

    const count = await this.query().countDocuments(filter).exec()

    return count
  }

  static async baseFindOneByKey (where = {}) {
    assert.object(where, { required: true })

    const data = await this.query().findOne(where).exec()

    if (!data) throw this.errorEmptyResponse()

    return data
  }

  static async baseGetById (id) {
    assert.id(id, { required: true })

    const data = await this.query().findById(id).exec()

    if (!data) throw this.errorEmptyResponse()

    return data
  }

  static async baseRemove (id, currentUserId) {
    assert.id(id, { required: true })

    const data = await this.query()
      .findByIdAndUpdate(id, {
        deletedAt: moment(),
        deletedBy: currentUserId
      }, { new: true })

    return data
  }

  static async baseRemoveWhere (where = {}) {
    assert.object(where, { required: true })

    const data = await mongoose.model(this.model).findOneAndRemove(where).exec()

    return data
  }
}

module.exports = { BaseDAO }
