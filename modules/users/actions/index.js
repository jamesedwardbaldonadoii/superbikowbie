const { ListUsersAction } = require('./ListUsersAction')
const { GetUserByIdAction } = require('./GetUserByIdAction')
const { CreateUserAction } = require('./CreateUserAction')
const { UpdateUserAction } = require('./UpdateUserAction')
const { RemoveUserAction } = require('./RemoveUserAction')

const { GetCurrentUserAction } = require('./GetCurrentUserAction')

const { ChangePasswordAction } = require('./ChangePasswordAction')
const { SendResetPasswordEmailAction } = require('./SendResetPasswordEmailAction')
const { ResetPasswordAction } = require('./ResetPasswordAction')

const { ConfirmRegistrationAction } = require('./ConfirmRegistrationAction')
const { ConfirmEmailAction } = require('./ConfirmEmailAction')
const { ResendConfirmNewEmailTokenAction } = require('./ResendConfirmNewEmailTokenAction')
const { ChangeEmailAction } = require('./ChangeEmailAction')
const { CancelEmailChangingAction } = require('./CancelEmailChangingAction')

// superadmin
const { UpdateUserPasswordAction } = require('./UpdateUserPasswordAction')
const { BulkUpdateUserAction } = require('./BulkUpdateUserAction')
const { BulkDeleteUserAction } = require('./BulkDeleteUserAction')

module.exports = {
  ListUsersAction,
  GetUserByIdAction,
  CreateUserAction,
  UpdateUserAction,
  RemoveUserAction,

  GetCurrentUserAction,

  ChangePasswordAction,
  SendResetPasswordEmailAction,
  ResetPasswordAction,

  ConfirmRegistrationAction,
  ConfirmEmailAction,
  ResendConfirmNewEmailTokenAction,
  ChangeEmailAction,
  CancelEmailChangingAction,

  // superadmin
  UpdateUserPasswordAction,
  BulkUpdateUserAction,
  BulkDeleteUserAction
}
