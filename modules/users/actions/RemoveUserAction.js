const Joi = require('joi');
const { BaseAction } = require('../../../rootcommon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');
const { updateUserPolicy } = require('../../../policy');

class RemoveUserAction extends BaseAction {
  static get accessTag () {
    return 'users:remove';
  }

  static get validationRules () {
    return {
      params: {
        id: Joi.string().required().uuid()
      }
    };
  }

  static async run (req) {
    const { currentUser } = req;
    const id = req.params.id;

    const model = await UserDAO.baseGetById(id);
    await updateUserPolicy(model, currentUser);
    await UserDAO.baseRemove(id, currentUser.id);

    return this.result({ message: `${id} was removed` });
  }
}

module.exports = { RemoveUserAction };
