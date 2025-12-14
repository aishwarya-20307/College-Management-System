// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ViewMarks from "./components/ViewMarks";
import AddMarks from "./components/AddMarks";
import Layout from "./components/Layout";
import FacultyDashboard from "./components/FacultyDashboard";   // ✅ ADD THIS

function App() {
  const user = JSON.parse(localStorage.getItem("user")); // check if user is logged in

  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes wrapped in Layout */}
      <Route
        element={user ? <Layout /> : <Navigate to="/login" />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-marks" element={<ViewMarks />} />
        <Route path="/add-marks" element={<AddMarks />} />

        {/* ✅ Faculty Dashboard */}
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      </Route>

      {/* Fallback for any unmatched route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
