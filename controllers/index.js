const { RootController } = require('../modules/root/RootController')
const { AuthController } = require('../modules/auth/AuthController')
const { UsersController } = require('../modules/users/UsersController')

module.exports = [
  RootController,
  AuthController,
  UsersController
]
