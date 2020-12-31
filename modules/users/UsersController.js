const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../rootcommmon/BaseController');

class UsersController extends BaseController {
  get router () {
    router
      .route('/users')
      .get(this.actionRunner(actions.ListUsersAction))
      .post(this.actionRunner(actions.CreateUserAction))
      .patch(this.actionRunner(actions.UpdateUserAction));

    router
      .route('/users:id')
      .get(this.actionRunner(actions.GetUserByIdAction))
      .delete(this.actionRunner(actions.RemoveUserAction));

    router.get('/users/current', this.actionRunner(actions.GetCurrentUserAction));

    router.post('/users/change-password', this.actionRunner(actions.ChangePasswordAction));
    router.post('/users/send-reset-password-email', this.actionRunner(actions.SendResetPasswordEmailAction));
    router.post('/users/reset-password', this.actionRunner(actions.ResetPasswordAction));

    router.post('/users/confirm-registration', this.actionRunner(actions.ConfirmRegistrationAction));
    router.post('/users/change-email', this.actionRunner(actions.ChangeEmailAction));
    router.post('/users/confirm-email', this.actionRunner(actions.ConfirmEmailAction));
    router.post('/users/resend-confirm-new-email-token', this.actionRunner(actions.ResendConfirmNewEmailTokenAction));
    router.post('/users/cancel-email-changing', this.actionRunner(actions.CancelEmailChangingAction));

    return router;
  }

  async init () {
    this.logger.debug(`${this.constructor.name} initialized...`);
  }
}

module.exports = { UsersController };
