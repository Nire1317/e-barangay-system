// src/utils/favicon.js

export const updateFaviconAndTitleByRole = (role) => {
  const favicon = document.getElementById("favicon");

  if (role === "official") {
    favicon.href = "/favicon.ico";
    document.title = "Barangay System - Official";
  } else if (role === "resident") {
    favicon.href = "/favicon.ico";
    document.title = "Barangay System - Resident";
  }
};
