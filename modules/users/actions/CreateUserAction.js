const Joi = require('joi');
const { BaseAction } = require('../../../rootcommmon/BaseAction');
// const { emailAgent } = require('../../RootProvider')
const { UserDAO } = require('../../../dao/UserDAO');
// const { WelcomeEmail } = require('../common/emails/WelcomeEmail')
const { makeEmailConfirmToken } = require('../common/makeEmailConfirmToken');
const { makePasswordHash } = require('../common/makePasswordHash');
const logger = require('../../../logger');

const { password } = require('../../../rootcommmon/customValidation');

class CreateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:create';
  }

  static get validationRules () {
    return {
      body: {
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        username: Joi.string().allow(null, ''),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password)
      }
    };
  }

  static async run (ctx) {
    const hash = await makePasswordHash(ctx.body.password);
    delete ctx.body.password;
    const user = await UserDAO.baseCreate({
      ...ctx.body,
      password: hash
    });

    const emailConfirmToken = await makeEmailConfirmToken(user);
    await UserDAO.baseUpdate(user.id, { emailConfirmToken });

    try {
      // const result = await emailAgent.send(new WelcomeEmail({
      //   to: user.email,
      //   username: user.username,
      //   emailConfirmToken
      // }))
      // logger.info('Registration email, delivered', { to: user.email, ...result, ctx: this.name })
    } catch (error) {
      if (error.statusCode) { // log mailGun errors
        logger.error(error.message, error, { ctx: this.name });
      } else {
        throw error;
      }
    }

    return this.result({ data: user.getPublicFields() });
  }
}

module.exports = { CreateUserAction };
