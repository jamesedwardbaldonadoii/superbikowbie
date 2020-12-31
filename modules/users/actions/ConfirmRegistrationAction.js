const Joi = require('joi');
const { errorCodes, AppError } = require('../../../lib');
const { BaseAction } = require('../../../rootcommmon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');
const { jwtVerify } = require('../../../rootcommmon/jwt');
const config = require('../../../config');
const logger = require('../../../logger');

class ConfirmRegistrationAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-registration';
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
    if (user.emailConfirmToken !== ctx.body.emailConfirmToken) {
      throw new AppError({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN });
    }

    await UserDAO.baseUpdate(userId, { isConfirmedRegistration: true, emailConfirmToken: null });
    logger.info('User registration is confirmed', { userId, ctx: this.name });

    return this.result({ message: `User ${userId} registration is confirmed` });
  }
}

module.exports = { ConfirmRegistrationAction };
