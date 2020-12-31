const moment = require('moment')

const { RequestRule, Rule, validator } = require('../../../lib')
const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')

class BulkDeleteUserAction extends BaseAction {
  static get accessTag () {
    return 'users:bulk-delete'
  }

  static get validationRules () {
    return {
      body: {
        id: new RequestRule(new Rule({
          validator: v => validator.isArray(v),
          description: 'array of mongodb ids'
        }))
      }
    }
  }

  static async run ({ body, currentUser }) {
    body.payload = {
      deletedAt: moment(),
      deletedBy: currentUser.id
    }

    const data = await UserDAO.baseBulkUpdate(body)

    return this.result({ data })
  }
}

module.exports = { BulkDeleteUserAction }
