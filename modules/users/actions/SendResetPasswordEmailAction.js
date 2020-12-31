const { BaseAction } = require('../../../rootcommmon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');
const { makeResetPasswordToken } = require('../common/makeResetPasswordToken');
// const { ResetPasswordEmail } = require('../common/emails/ResetPasswordEmail')
// const { emailAgent } = require('../../RootProvider')

const Joi = require('joi');
/**
 * 1) get email from body request
 * 2) find user in DB by email
 * 3) generate and store resetPasswordToken to DB
 * 4) send reset email
 */
class SendResetPasswordEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:send-reset-password-email';
  }

  static get validationRules () {
    return {
      body: {
        email: Joi.string().required().email()
      }
    };
  }

  static async run (ctx) {
    const user = await UserDAO.getByEmail(ctx.body.email);
    const resetPasswordToken = await makeResetPasswordToken(user);
    await UserDAO.baseUpdate(user.id, { resetPasswordToken });

    // await emailAgent.send(new ResetPasswordEmail({ to: user.email, resetPasswordToken }))

    return this.result({ message: 'Reset password email delivered' });
  }
}

module.exports = { SendResetPasswordEmailAction };
