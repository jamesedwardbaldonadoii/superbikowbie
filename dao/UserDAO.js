const { assert } = require('../lib')
const { BaseDAO } = require('../rootcommmon/BaseDAO')

// Load User model
const mongoose = require('mongoose')
const User = mongoose.model('users')

class UserDAO extends BaseDAO {
  static get model () {
    return 'users'
  }

  /**
   * Exclude private data
   */
  static get excluded () {
    return '-password -deletedAt -provider -providerId -providerData'
  }

  /**
   ******************************************
   * @METHODS
   ******************************************
  */

  /**
   * Get user by email
   * @param {String} email required and not empty
   * @returns {Promise<object>}
   */
  static async getByEmail (email) {
    assert.string(email, { required: true, notEmpty: true })

    const user = await User.findOne({ email }).exec()

    if (!user) throw this.errorEmptyResponse()

    return user
  }

  /**
   * Get current user
   * @param {ObjectId} id required mognoose ObjectId
   * @returns {Promise<object>}
   */
  static async getCurrentUser (id) {
    assert.uuid(id, { required: true })

    const user = await User.findById(id).select(this.excluded).exec()

    if (!user) throw this.errorEmptyResponse()

    return user
  }

  /**
   * Check email availability in DB.
   * @param {String} email required and not empty
   * @returns {Promise<boolean>}
   */
  static async isEmailExist (email) {
    assert.string(email, { required: true, notEmpty: true })

    const user = await User.findOne({ email }).exec()

    return Boolean(user)
  }
}

module.exports = { UserDAO }
