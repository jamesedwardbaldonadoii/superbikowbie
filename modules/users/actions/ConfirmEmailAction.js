const Joi = require('joi');
const { errorCodes, AppError } = require('../../../lib');
const { BaseAction } = require('../../../rootcommon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');
const { jwtVerify } = require('../../../rootcommon/jwt');
const config = require('../../../config');
const logger = require('../../../logger');

class ConfirmEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-email';
  }

  static get validationRules () {
    return {
      body: {
        emailConfirmToken: Joi.string().required()
      }
    };
  }

  static async run (ctx) {
    const tokenData = await jwtVerify(ctx.body.emailConfirmToken, config.token.emailConfirm.secret);
    const { sub: userId } = tokenData;

    const user = await UserDAO.baseGetById(userId);
    const newEmail = user.newEmail;
    if (user.emailConfirmToken !== ctx.body.emailConfirmToken) {
      throw new AppError({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN });
    }
    await UserDAO.baseUpdate(userId, {
      email: newEmail,
      newEmail: null,
      emailConfirmToken: null
    });

    logger.info('User email confirmed', { userId, newEmail, ctx: this.name });

    return this.result({ message: `${newEmail} confirmed` });
  }
}

module.exports = { ConfirmEmailAction };
