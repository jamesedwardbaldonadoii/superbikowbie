const { RequestRule, Rule } = require('../../../lib')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { updateUserPolicy } = require('../../../policy')

const ObjectId = require('mongoose').Types.ObjectId

class RemoveUserAction extends BaseAction {
  static get accessTag () {
    return 'users:remove'
  }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(new Rule({
          validator: v => typeof v === 'string' && ObjectId.isValid(v) === true,
          description: 'MongoDB UUID'
        }))
      }
    }
  }

  static async run (req) {
    const { currentUser } = req
    const id = req.params.id

    const model = await UserDAO.baseGetById(id)
    await updateUserPolicy(model, currentUser)
    await UserDAO.baseRemove(id, currentUser.id)

    return this.result({ message: `${id} was removed` })
  }
}

module.exports = { RemoveUserAction }
