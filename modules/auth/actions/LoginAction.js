const ms = require('ms');
const { AppError, errorCodes } = require('../../../lib');

const Joi = require('joi');

const { CookieEntity } = require('../../../rootcommon/CookieEntity');
const { BaseAction } = require('../../../rootcommon/BaseAction');
const { addRefreshSession } = require('../common/addRefreshSession');
const { UserDAO } = require('../../../dao/UserDAO');
const { RefreshSessionEntity } = require('../common/RefreshSessionEntity');
const { makeAccessToken } = require('../common/makeAccessToken');
const { checkPassword } = require('../../../rootcommon/checkPassword');
const config = require('../../../config');

const { fingerprint } = require('../../../rootcommon/customValidation');

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login';
  }

  static get validationRules () {
    return {
      body: {
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        fingerprint: Joi.string().required().custom(fingerprint)
      }
    };
  }

  static async run (ctx) {
    let user = {};
    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.token.refresh.expiresIn);
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000);

    try {
      user = await UserDAO.getByEmail(ctx.body.email);

      await checkPassword(ctx.body.password, user.password);
    } catch (e) {
      if (
        [errorCodes.NOT_FOUND.code, errorCodes.INVALID_PASSWORD.code].includes(
          e.code
        )
      ) {
        throw new AppError({ ...errorCodes.INVALID_CREDENTIALS });
      }
      throw e;
    }

    const newRefreshSession = new RefreshSessionEntity({
      user: user._id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint,
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
          // domain: config.app.url,
          path: '/auth',
          maxAge: refTokenExpiresInSeconds,
          secure: false // temp: for local developmenmt
        })
      ]
    });
  }
}

module.exports = { LoginAction };
