const Joi = require('joi');
const { BaseAction } = require('../../../rootcommon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO');
const { makePasswordHash } = require('../common/makePasswordHash');
const { checkPassword } = require('../../../rootcommon/checkPassword');
const { password } = require('../../../rootcommon/customValidation');

class ChangePasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-password';
  }

  static get validationRules () {
    return {
      body: {
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required().custom(password)
      }
    };
  }

  static async run (ctx) {
    const { currentUser } = ctx;

    const userModel = await UserDAO.baseGetById(currentUser.id);
    await checkPassword(ctx.body.oldPassword, userModel.password);
    const newHash = await makePasswordHash(ctx.body.newPassword);

    await Promise.all([
      RefreshSessionDAO.baseRemoveWhere({ userId: currentUser.id }), // Changing password will remove all logged in refresh sessions
      UserDAO.baseUpdate(currentUser.id, { password: newHash })
    ]);

    return this.result({ message: 'Password changed' });
  }
}

module.exports = { ChangePasswordAction };
