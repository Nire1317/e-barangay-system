
export const ROLES = {
  RESIDENT: "resident",
  OFFICIAL: "official",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  // Request permissions
  VIEW_OWN_REQUESTS: "view_own_requests",
  VIEW_ALL_REQUESTS: "view_all_requests",
  CREATE_REQUEST: "create_request",
  UPDATE_REQUEST: "update_request",
  APPROVE_REQUEST: "approve_request",
  DELETE_REQUEST: "delete_request",

  // Barangay request permissions
  CREATE_BARANGAY_REQUEST: "create_barangay_request",
  VIEW_OWN_BARANGAY_REQUESTS: "view_own_barangay_requests",
  VIEW_ALL_BARANGAY_REQUESTS: "view_all_barangay_requests",
  APPROVE_BARANGAY_REQUEST: "approve_barangay_request",
  REJECT_BARANGAY_REQUEST: "reject_barangay_request",
  CANCEL_OWN_BARANGAY_REQUEST: "cancel_own_barangay_request",

  // Official verification permissions
  REQUEST_OFFICIAL_VERIFICATION: "request_official_verification",
  VIEW_OWN_VERIFICATION: "view_own_verification",
  VIEW_ALL_VERIFICATIONS: "view_all_verifications",
  APPROVE_VERIFICATION: "approve_verification",
  REJECT_VERIFICATION: "reject_verification",
  CANCEL_OWN_VERIFICATION: "cancel_own_verification",

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

  // Admin-only permissions
  VIEW_ALL_BARANGAYS: "view_all_barangays",
  MANAGE_ALL_VERIFICATIONS: "manage_all_verifications",
  SYSTEM_ADMINISTRATION: "system_administration",
};

// Define what each role can do
const RESIDENT_PERMISSIONS = [
  PERMISSIONS.VIEW_OWN_REQUESTS,
  PERMISSIONS.CREATE_REQUEST,
  PERMISSIONS.UPDATE_REQUEST,
  PERMISSIONS.VIEW_OWN_PROFILE,
  PERMISSIONS.CREATE_BARANGAY_REQUEST,
  PERMISSIONS.VIEW_OWN_BARANGAY_REQUESTS,
  PERMISSIONS.CANCEL_OWN_BARANGAY_REQUEST,
  PERMISSIONS.REQUEST_OFFICIAL_VERIFICATION,
  PERMISSIONS.VIEW_OWN_VERIFICATION,
  PERMISSIONS.CANCEL_OWN_VERIFICATION,
];

const OFFICIAL_PERMISSIONS = [
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
  PERMISSIONS.VIEW_ALL_BARANGAY_REQUESTS,
  PERMISSIONS.APPROVE_BARANGAY_REQUEST,
  PERMISSIONS.REJECT_BARANGAY_REQUEST,
  PERMISSIONS.VIEW_ALL_VERIFICATIONS,
  PERMISSIONS.APPROVE_VERIFICATION,
  PERMISSIONS.REJECT_VERIFICATION,
];

const ADMIN_PERMISSIONS = [
  // Admins inherit all official permissions
  ...OFFICIAL_PERMISSIONS,
  // Plus admin-specific permissions
  PERMISSIONS.VIEW_ALL_BARANGAYS,
  PERMISSIONS.MANAGE_ALL_VERIFICATIONS,
  PERMISSIONS.SYSTEM_ADMINISTRATION,
];

export const ROLE_PERMISSIONS = {
  [ROLES.RESIDENT]: RESIDENT_PERMISSIONS,
  [ROLES.OFFICIAL]: OFFICIAL_PERMISSIONS,
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
};

// Route access configuration
export const ROUTE_ACCESS = {
  "/dashboard": [ROLES.RESIDENT, ROLES.OFFICIAL, ROLES.ADMIN],
  "/requests": [ROLES.RESIDENT, ROLES.OFFICIAL, ROLES.ADMIN],
  "/requests/new": [ROLES.RESIDENT, ROLES.OFFICIAL, ROLES.ADMIN],
  "/join-barangay": [ROLES.RESIDENT],
  "/request-verification": [ROLES.RESIDENT],
  "/admin": [ROLES.OFFICIAL],
  "/superadmin": [ROLES.ADMIN],
  "/barangay-requests": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/official-verifications": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/super-admin-verifications": [ROLES.ADMIN],
  "/admin/requests": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/admin/residents": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/admin/reports": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/admin/activity-logs": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/manage-requests": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/residents": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/reports": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/official-panel": [ROLES.OFFICIAL, ROLES.ADMIN],
  "/settings": [ROLES.OFFICIAL, ROLES.ADMIN],
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROUTE_ACCESS,
};
