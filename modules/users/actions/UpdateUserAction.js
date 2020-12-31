const { RequestRule, Rule } = require('../../../lib')
const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { updateUserPolicy } = require('../../../policy')

const ObjectId = require('mongoose').Types.ObjectId
const UserSchema = require('../../../models/UserSchema')

class UpdateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:update'
  }

  static get validationRules () {
    return {
      body: {
        id: new RequestRule(new Rule({
          validator: v => typeof v === 'string' && ObjectId.isValid(v) === true,
          description: 'MongoDB UUID'
        })),
        username: new RequestRule(UserSchema.obj.username.validation),
        email: new RequestRule(UserSchema.obj.email.validation),
        firstname: new RequestRule(UserSchema.obj.firstname.validation),
        lastname: new RequestRule(UserSchema.obj.lastname.validation),
        suffix: new RequestRule(UserSchema.obj.suffix.validation),
        role: new RequestRule(UserSchema.obj.role.validation)
      }
    }
  }

  static async run (ctx) {
    const { currentUser, body } = ctx

    await updateUserPolicy(body, currentUser)
    const data = await UserDAO.baseUpdate(body.id ? body.id : currentUser.id, body)

    return this.result({ data })
  }
}

module.exports = { UpdateUserAction }
