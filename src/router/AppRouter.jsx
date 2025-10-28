import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/client/Dashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
