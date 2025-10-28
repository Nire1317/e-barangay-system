// src/components/PermissionGate.jsx

import { usePermissions } from "../hooks/usePermissions";

/**
 * PermissionGate - Conditionally renders children based on permissions
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string} props.permission - Single permission required
 * @param {string[]} props.permissions - Multiple permissions (uses ANY logic by default)
 * @param {boolean} props.requireAll - If true, requires ALL permissions (default: false)
 * @param {React.ReactNode} props.fallback - Content to render if unauthorized
 */
export const PermissionGate = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}) => {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  // Single permission check
  if (permission) {
    hasAccess = can(permission);
  }
  // Multiple permissions check
  else if (permissions && Array.isArray(permissions)) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }
  // No permissions specified - deny access
  else {
    hasAccess = false;
  }

  return hasAccess ? children : fallback;
};

/**
 * RoleGate - Conditionally renders children based on user role
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles that can see the content
 * @param {React.ReactNode} props.fallback - Content to render if unauthorized
 */
export const RoleGate = ({ children, allowedRoles = [], fallback = null }) => {
  const { role } = usePermissions();

  const hasAccess = allowedRoles.includes(role);

  return hasAccess ? children : fallback;
};

/**
 * OfficialOnly - Shorthand component for official-only content
 */
export const OfficialOnly = ({ children, fallback = null }) => {
  const { isOfficial } = usePermissions();
  return isOfficial ? children : fallback;
};

/**
 * ResidentOnly - Shorthand component for resident-only content
 */
export const ResidentOnly = ({ children, fallback = null }) => {
  const { isResident } = usePermissions();
  return isResident ? children : fallback;
};
