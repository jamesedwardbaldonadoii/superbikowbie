const ms = require('ms');
const Joi = require('joi');

const { AppError, errorCodes } = require('../../../lib');

const { CookieEntity } = require('../../../rootcommmon/CookieEntity');
const { BaseAction } = require('../../../rootcommmon/BaseAction');
const { addRefreshSession } = require('../common/addRefreshSession');
const { verifyRefreshSession } = require('../common/verifyRefreshSession');
const { makeAccessToken } = require('../common/makeAccessToken');
const { RefreshSessionEntity } = require('../common/RefreshSessionEntity');
const { UserDAO } = require('../../../dao/UserDAO');
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO');
const { fingerprint } = require('../../../rootcommmon/customValidation');

const config = require('../../../config');

class RefreshTokensAction extends BaseAction {
  static get accessTag () {
    return 'auth:refresh-tokens';
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        fingerprint: Joi.string().required().custom(fingerprint),
        refreshToken: Joi.string().allow(null, '').uuid()
      }),
      cookies: {
        refreshToken: Joi.string().allow(null, '').uuid()
      }
    };
  }

  static async run (ctx) {
    // take refresh token from any possible source
    const reqRefreshToken = ctx.cookies.refreshToken || ctx.body.refreshToken;
    const reqFingerprint = ctx.body.fingerprint;

    if (!reqRefreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' });
    }

    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.token.refresh.expiresIn);
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000);

    const oldRefreshSession = await RefreshSessionDAO.getByRefreshToken(reqRefreshToken);
    await RefreshSessionDAO.baseRemoveWhere({ refreshToken: reqRefreshToken });
    await verifyRefreshSession(new RefreshSessionEntity(oldRefreshSession), reqFingerprint);
    const user = await UserDAO.baseGetById(oldRefreshSession.user);

    const newRefreshSession = new RefreshSessionEntity({
      user: user,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: reqFingerprint,
      expiresIn: refTokenExpiresInMilliseconds
    });

    await addRefreshSession(newRefreshSession);

    return this.result({
      data: {
        accessToken: await makeAccessToken(user),
        refreshToken: newRefreshSession.refreshToken
      },
      cookies: [
        new CookieEntity({
          name: 'refreshToken',
          value: newRefreshSession.refreshToken,
          domain: 'localhost',
          path: '/auth',
          maxAge: refTokenExpiresInSeconds,
          secure: false // for loca development only
        })
      ]
    });
  }
}

module.exports = { RefreshTokensAction };
