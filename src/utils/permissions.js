// src/utils/permissions.js

import { ROLE_PERMISSIONS, ROUTE_ACCESS, ROLES } from "../config/rbac";

/**
 * Check if a role has a specific permission
 * @param {string} role - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;

  const rolePermissions = ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;

  return rolePermissions.includes(permission);
};

/**
 * Check if a role has ANY of the specified permissions
 * @param {string} role - User's role
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;

  return permissions.some((permission) => hasPermission(role, permission));
};

/**
 * Check if a role has ALL of the specified permissions
 * @param {string} role - User's role
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;

  return permissions.every((permission) => hasPermission(role, permission));
};

/**
 * Check if a role can access a specific route
 * @param {string} role - User's role
 * @param {string} path - Route path
 * @returns {boolean}
 */
export const canAccessRoute = (role, path) => {
  if (!role || !path) return false;

  const allowedRoles = ROUTE_ACCESS[path];
  if (!allowedRoles) return true; // If route not defined, allow access

  return allowedRoles.includes(role);
};

/**
 * Check if user is an official
 * @param {string} role - User's role
 * @returns {boolean}
 */
export const isOfficial = (role) => {
  return role === ROLES.OFFICIAL;
};

/**
 * Check if user is a resident
 * @param {string} role - User's role
 * @returns {boolean}
 */
export const isResident = (role) => {
  return role === ROLES.RESIDENT;
};

/**
 * Get all permissions for a role
 * @param {string} role - User's role
 * @returns {string[]}
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Get user-friendly role name
 * @param {string} role - User's role
 * @returns {string}
 */
export const getRoleName = (role) => {
  const roleNames = {
    [ROLES.RESIDENT]: "Resident",
    [ROLES.OFFICIAL]: "Barangay Official",
  };

  return roleNames[role] || "Unknown";
};
