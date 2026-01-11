import { supabase } from "./supabaseClient";

/**
 * Get dashboard statistics for an official
 * @param {string} barangayId - The barangay ID of the official
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function getDashboardStats(barangayId) {
  try {
    // Get pending requests count
    const { count: pendingRequests, error: pendingError } = await supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    if (pendingError) throw pendingError;

    // Get total residents in the barangay
    const { count: totalResidents, error: residentsError } = await supabase
      .from("residents")
      .select("*", { count: "exact", head: true })
      .eq("barangay_id", barangayId);

    if (residentsError) throw residentsError;

    // Get completed requests today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: completedToday, error: completedError } = await supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Completed")
      .gte("submitted_at", todayISO);

    if (completedError) throw completedError;

    // Get total activity logs count
    const { count: activityLogs, error: logsError } = await supabase
      .from("activity_logs")
      .select("*", { count: "exact", head: true });

    if (logsError) throw logsError;

    return {
      pendingRequests: pendingRequests || 0,
      totalResidents: totalResidents || 0,
      completedToday: completedToday || 0,
      activityLogs: activityLogs || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Get weekly requests data for chart
 * @returns {Promise<Array>} Array of daily request counts for the past 7 days
 */
export async function getWeeklyRequestsData() {
  try {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = [];

    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const startOfDay = date.toISOString();

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endOfDay = endDate.toISOString();

      const { count, error } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .gte("submitted_at", startOfDay)
        .lte("submitted_at", endOfDay);

      if (error) throw error;

      chartData.push({
        name: days[date.getDay()],
        requests: count || 0,
      });
    }

    return chartData;
  } catch (error) {
    console.error("Error fetching weekly requests data:", error);
    throw error;
  }
}

/**
 * Get recent activity logs
 * @param {number} limit - Number of recent activities to fetch (default: 10)
 * @returns {Promise<Array>} Array of recent activity logs
 */
export async function getRecentActivities(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select(
        `
        log_id,
        action,
        details,
        created_at,
        users (
          full_name,
          role
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform the data to match the expected format
    const activities = data.map((log) => ({
      id: log.log_id,
      action: log.action,
      time: formatTimeAgo(new Date(log.created_at)),
      user: log.users?.full_name || "System",
      type: determineActivityType(log.action, log.users?.role),
      details: log.details,
    }));

    return activities;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
}

/**
 * Format time difference to human-readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted time ago string
 */
function formatTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes === 1) return "1 minute ago";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}

/**
 * Determine activity type based on action and role
 * @param {string} action - The action performed
 * @param {string} role - The role of the user
 * @returns {string} Activity type
 */
function determineActivityType(action, role) {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("register") || actionLower.includes("signup")) {
    return "registration";
  }
  if (
    actionLower.includes("approve") ||
    actionLower.includes("reject") ||
    actionLower.includes("review")
  ) {
    return "approval";
  }
  if (role === "official" || actionLower.includes("admin")) {
    return "system";
  }

  return "general";
}

/**
 * Get statistics trends for dashboard
 * @param {string} barangayId - The barangay ID
 * @returns {Promise<Object>} Trend statistics
 */
export async function getStatsTrends(barangayId) {
  try {
    // Get yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayISO = yesterday.toISOString();

    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    const yesterdayEndISO = yesterdayEnd.toISOString();

    const { count: yesterdayPending, error: pendingError } = await supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending")
      .gte("submitted_at", yesterdayISO)
      .lte("submitted_at", yesterdayEndISO);

    if (pendingError) throw pendingError;

    // Get this month's new residents
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthISO = startOfMonth.toISOString();

    const { count: newResidentsThisMonth, error: residentsError } =
      await supabase
        .from("residents")
        .select("*", { count: "exact", head: true })
        .eq("barangay_id", barangayId)
        .gte("created_at", startOfMonthISO);

    if (residentsError) throw residentsError;

    return {
      pendingFromYesterday: yesterdayPending || 0,
      newResidentsThisMonth: newResidentsThisMonth || 0,
    };
  } catch (error) {
    console.error("Error fetching stats trends:", error);
    throw error;
  }
}
