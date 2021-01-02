const BaseRoleAccess = require('./BaseRoleAccess');

class RoleSuperAdminAccess extends BaseRoleAccess {
  static get can () {
    return {
      ...this.basePermissions,

      'users:remove': true,
      'users:change-employee-password': true,
      'users:bulk-delete': true,
      'users:bulk-update': true
    };
  }
}

module.exports = RoleSuperAdminAccess;
