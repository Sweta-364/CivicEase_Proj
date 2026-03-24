export const ROLE_MAIN_ADMIN = 'org_main_admin';
export const ROLE_DEPARTMENT_ADMIN = 'department_admin';
export const ROLE_REPORTER = 'reporter';

export function getUserRoles(user) {
  return user?.roles ?? [];
}

export function hasRole(user, role) {
  return getUserRoles(user).some((entry) => entry.role === role);
}

export function isMainAdmin(user) {
  return hasRole(user, ROLE_MAIN_ADMIN);
}

export function isDepartmentAdmin(user) {
  return hasRole(user, ROLE_DEPARTMENT_ADMIN);
}

export function isReporter(user) {
  return hasRole(user, ROLE_REPORTER);
}

export function canAccessAdminIssues(user) {
  return isMainAdmin(user) || isDepartmentAdmin(user);
}

export function canCreateAdminResource(user) {
  return isMainAdmin(user) || isDepartmentAdmin(user);
}

export function getDepartmentAdminIds(user) {
  return getUserRoles(user)
    .filter((entry) => entry.role === ROLE_DEPARTMENT_ADMIN && entry.department_id != null)
    .map((entry) => entry.department_id);
}
