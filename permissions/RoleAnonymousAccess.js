class RoleAnonymousAccess {
  static get can () {
    return {
      'users:create': true,
      'users:list': true,
      'users:get-by-id': true,
      'users:confirm-registration': true,
      'users:confirm-email': true,
      'users:send-reset-password-email': true,
      'users:reset-password': true,

      'auth:login': true,
      'auth:refresh-tokens': true
    };
  }
}

module.exports = RoleAnonymousAccess;
