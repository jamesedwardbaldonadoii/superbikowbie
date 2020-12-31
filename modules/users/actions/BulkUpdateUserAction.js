const { RequestRule, Rule, validator } = require('../../../lib')
const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')

const UserSchema = require('../../../models/UserSchema')

class BulkUpdateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:bulk-update'
  }

  static get validationRules () {
    return {
      body: {
        id: new RequestRule(new Rule({
          validator: v => validator.isArray(v),
          description: 'array of mongodb ids'
        })),
        role: new RequestRule(UserSchema.obj.role.validation)
      }
    }
  }

  static async run ({ body }) {
    body.payload = {
      ...body,
      id: undefined
    }
    const data = await UserDAO.baseBulkUpdate(body)

    return this.result({ data })
  }
}

module.exports = { BulkUpdateUserAction }
