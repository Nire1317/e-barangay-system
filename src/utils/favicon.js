// src/utils/favicon.js

export const updateFaviconAndTitleByRole = (role) => {
  const favicon = document.getElementById("favicon");

  if (role === "official") {
    favicon.href = "/official-icon.png";
    document.title = "Barangay System - Official";
  } else if (role === "resident") {
    favicon.href = "/resident-icon.png";
    document.title = "Barangay System - Resident";
  }
};
