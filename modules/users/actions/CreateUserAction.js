const { RequestRule } = require('../../../lib')
const { BaseAction } = require('../../../rootcommmon/BaseAction')
// const { emailAgent } = require('../../RootProvider')
const { UserDAO } = require('../../../dao/UserDAO')
// const { WelcomeEmail } = require('../common/emails/WelcomeEmail')
const { makeEmailConfirmToken } = require('../common/makeEmailConfirmToken')
const { makePasswordHash } = require('../common/makePasswordHash')
const logger = require('../../../logger')

const UserSchema = require('../../../models/UserSchema')

class CreateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get validationRules () {
    return {
      body: {
        firstname: new RequestRule(UserSchema.obj.firstname.validation, { required: true }),
        lastname: new RequestRule(UserSchema.obj.lastname.validation, { required: true }),
        username: new RequestRule(UserSchema.obj.username.validation, { required: false }),
        email: new RequestRule(UserSchema.obj.email.validation, { required: true }),
        password: new RequestRule(UserSchema.obj.password.validation, { required: true }),
        role: new RequestRule(UserSchema.obj.role.validation, { required: false })
      }
    }
  }

  static async run (ctx) {
    const hash = await makePasswordHash(ctx.body.password)
    delete ctx.body.password
    const user = await UserDAO.baseCreate({
      ...ctx.body,
      password: hash
    })

    const emailConfirmToken = await makeEmailConfirmToken(user)
    await UserDAO.baseUpdate(user.id, { emailConfirmToken })

    try {
      // const result = await emailAgent.send(new WelcomeEmail({
      //   to: user.email,
      //   username: user.username,
      //   emailConfirmToken
      // }))
      // logger.info('Registration email, delivered', { to: user.email, ...result, ctx: this.name })
    } catch (error) {
      if (error.statusCode) { // log mailGun errors
        logger.error(error.message, error, { ctx: this.name })
      } else {
        throw error
      }
    }

    return this.result({ data: user.getPublicFields() })
  }
}

module.exports = { CreateUserAction }
