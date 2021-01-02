const roles = require('./roles');
const RoleUserAccess = require('./RoleUserAccess');
const RoleAnonymousAccess = require('./RoleAnonymousAccess');
const RoleSuperAdminAccess = require('./RoleSuperAdminAccess');

module.exports = {
  [roles.superadmin]: {
    ...RoleSuperAdminAccess.can,
    ...RoleAnonymousAccess.can
  },
  [roles.anonymous]: RoleAnonymousAccess.can,
  [roles.user]: RoleUserAccess.can
};
