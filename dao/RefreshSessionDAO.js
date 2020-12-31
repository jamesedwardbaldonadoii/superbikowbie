const { assert } = require('../lib')
const { BaseDAO } = require('../rootcommmon/BaseDAO')

class RefreshSessionDAO extends BaseDAO {
  static get model () {
    return 'sessions'
  }

  /**
   ******************************************
   * @METHODS
   ******************************************
  */

  /**
   * Get by refresh token value
   * @param {String} refreshToken required
   * @returns {Promise<object>}
   */
  static async getByRefreshToken (refreshToken) {
    assert.string(refreshToken, { required: true, notEmpty: true })

    const result = await this.baseFindOneByKey({ refreshToken })

    if (!result) throw this.errorEmptyResponse()

    return result
  }
}

module.exports = { RefreshSessionDAO }
