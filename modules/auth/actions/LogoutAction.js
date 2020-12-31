const { RequestRule, AppError, errorCodes } = require('../../../lib')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO')

const SessionSchema = require('../../../models/SessionSchema')

/**
 * remove current session
 */
class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static get validationRules () {
    return {
      body: {
        refreshToken: new RequestRule(SessionSchema.obj.refreshToken.validation)
      },
      cookies: {
        refreshToken: new RequestRule(SessionSchema.obj.refreshToken.validation)
      }
    }
  }

  static async run (ctx) {
    // take refresh token from any possible source
    const refreshToken = ctx.cookies.refreshToken || ctx.body.refreshToken
    if (!refreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' })
    }

    await RefreshSessionDAO.baseRemoveWhere({ refreshToken })

    return this.result({ message: 'User is logged out from current session.' })
  }
}

module.exports = { LogoutAction }
