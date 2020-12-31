const { RequestRule, Rule } = require('../../../lib')
const ObjectId = require('mongoose').Types.ObjectId
const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { makePasswordHash } = require('../common/makePasswordHash')

const UserSchema = require('../../../models/UserSchema')

class UpdateUserPasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-employee-password'
  }

  static get validationRules () {
    return {
      body: {
        id: new RequestRule(new Rule({
          validator: v => typeof v === 'string' && ObjectId.isValid(v) === true,
          description: 'MongoDB UUID'
        }), { required: true }),
        newPassword: new RequestRule(UserSchema.obj.password.validation, { required: true })
      }
    }
  }

  static async run (ctx) {
    const newHash = await makePasswordHash(ctx.body.newPassword)

    await Promise.all([
      UserDAO.baseUpdate(ctx.body.id, { password: newHash })
    ])

    return this.result({ message: 'Password updated!' })
  }
}

module.exports = { UpdateUserPasswordAction }
