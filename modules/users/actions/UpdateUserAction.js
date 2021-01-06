const Joi = require('joi');
const { BaseAction } = require('../../../rootcommon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');
const { updateUserPolicy } = require('../../../policy');

class UpdateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:update';
  }

  static get validationRules () {
    return {
      body: {
        id: Joi.string().required().uuid(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        username: Joi.string().allow(null, ''),
        email: Joi.string().required().email()
      }
    };
  }

  static async run (ctx) {
    const { currentUser, body } = ctx;

    await updateUserPolicy(body, currentUser);
    const data = await UserDAO.baseUpdate(body.id ? body.id : currentUser.id, body);

    return this.result({ data });
  }
}

module.exports = { UpdateUserAction };
