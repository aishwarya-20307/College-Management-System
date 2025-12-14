// src/components/Layout.js
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `hover:bg-gray-700 p-2 rounded ${
      isActive ? "bg-gray-700 font-bold" : ""
    }`;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">CMIS</h2>
        <nav className="flex flex-col space-y-3">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/view-marks" className={linkClass}>
            View Marks
          </NavLink>
          <NavLink to="/add-marks" className={linkClass}>
            Add Marks
          </NavLink>
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
