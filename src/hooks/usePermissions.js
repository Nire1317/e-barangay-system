// src/hooks/usePermissions.js

import { useAuth } from "./useAuth";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  isOfficial,
  isResident,
  getRolePermissions,
  getRoleName,
} from "../utils/permissions";

/**
 * Custom hook for permission checking
 * @returns {object} Permission checking functions
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role;

  return {
    // Permission checks
    can: (permission) => hasPermission(role, permission),
    canAny: (permissions) => hasAnyPermission(role, permissions),
    canAll: (permissions) => hasAllPermissions(role, permissions),

    // Route access
    canAccessRoute: (path) => canAccessRoute(role, path),

    // Role checks
    isOfficial: isOfficial(role),
    isResident: isResident(role),

    // Role info
    role: role,
    roleName: getRoleName(role),
    permissions: getRolePermissions(role),
  };
};
