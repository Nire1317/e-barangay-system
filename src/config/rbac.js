
export const ROLES = {
  RESIDENT: "resident",
  OFFICIAL: "official",
};

export const PERMISSIONS = {
  // Request permissions
  VIEW_OWN_REQUESTS: "view_own_requests",
  VIEW_ALL_REQUESTS: "view_all_requests",
  CREATE_REQUEST: "create_request",
  UPDATE_REQUEST: "update_request",
  APPROVE_REQUEST: "approve_request",
  DELETE_REQUEST: "delete_request",

  // Resident permissions
  VIEW_OWN_PROFILE: "view_own_profile",
  VIEW_ALL_RESIDENTS: "view_all_residents",
  MANAGE_RESIDENTS: "manage_residents",

  // Report permissions
  GENERATE_REPORTS: "generate_reports",
  VIEW_ANALYTICS: "view_analytics",

  // Activity log permissions
  VIEW_ACTIVITY_LOGS: "view_activity_logs",

  // User management
  MANAGE_USERS: "manage_users",
};

// Define what each role can do
export const ROLE_PERMISSIONS = {
  [ROLES.RESIDENT]: [
    PERMISSIONS.VIEW_OWN_REQUESTS,
    PERMISSIONS.CREATE_REQUEST,
    PERMISSIONS.UPDATE_REQUEST,
    PERMISSIONS.VIEW_OWN_PROFILE,
  ],
  [ROLES.OFFICIAL]: [
    PERMISSIONS.VIEW_OWN_REQUESTS,
    PERMISSIONS.VIEW_ALL_REQUESTS,
    PERMISSIONS.CREATE_REQUEST,
    PERMISSIONS.UPDATE_REQUEST,
    PERMISSIONS.APPROVE_REQUEST,
    PERMISSIONS.DELETE_REQUEST,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.VIEW_ALL_RESIDENTS,
    PERMISSIONS.MANAGE_RESIDENTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_ACTIVITY_LOGS,
    PERMISSIONS.MANAGE_USERS,
  ],
};

// Route access configuration
export const ROUTE_ACCESS = {
  "/dashboard": [ROLES.RESIDENT, ROLES.OFFICIAL],
  "/requests": [ROLES.RESIDENT, ROLES.OFFICIAL],
  "/requests/new": [ROLES.RESIDENT, ROLES.OFFICIAL],
  "/admin": [ROLES.OFFICIAL],
  "/admin/requests": [ROLES.OFFICIAL],
  "/admin/residents": [ROLES.OFFICIAL],
  "/admin/reports": [ROLES.OFFICIAL],
  "/admin/activity-logs": [ROLES.OFFICIAL],
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROUTE_ACCESS,
};
