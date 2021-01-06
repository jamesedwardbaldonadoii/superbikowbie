const Joi = require('joi');
const { BaseAction } = require('../../../rootcommon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');

/**
 * @description return user by id
 */
class GetUserByIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-by-id';
  }

  static get validationRules () {
    return {
      params: {
        id: Joi.string().required().uuid()
      }
    };
  }

  static async run (ctx) {
    const model = await UserDAO.baseGetById(ctx.params.id);

    return this.result({ data: model });
  }
}

module.exports = { GetUserByIdAction };
