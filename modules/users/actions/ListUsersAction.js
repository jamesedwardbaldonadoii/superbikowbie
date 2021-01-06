const { BaseAction } = require('../../../rootcommon/BaseAction');
const { UserDAO } = require('../../../dao/UserDAO');

/**
 * @description return users list
 */
class ListUsersAction extends BaseAction {
  static get accessTag () {
    return 'users:list';
  }

  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams
      }
    };
  }

  static async run (req) {
    const { query } = req;

    if (!query.fields) query.fields = '-password -provider';

    const { data, total } = await UserDAO.baseGetList({ ...query });

    return this.result({
      data: data,
      headers: {
        'X-Total-Count': total
      }
    });
  }
}

module.exports = { ListUsersAction };
