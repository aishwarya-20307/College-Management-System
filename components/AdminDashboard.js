import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    pendingFees: 0,
    attendancePercentage: 0
  });

  const loadStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log("Error loading dashboard");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <div style={{ width: "200px", padding: "20px", background: "#ffe0e0", borderRadius: "10px" }}>
          <h3>Total Students</h3>
          <h2>{stats.totalStudents}</h2>
        </div>

        <div style={{ width: "200px", padding: "20px", background: "#e0ffe6", borderRadius: "10px" }}>
          <h3>Total Faculty</h3>
          <h2>{stats.totalFaculty}</h2>
        </div>

        <div style={{ width: "200px", padding: "20px", background: "#e0f2ff", borderRadius: "10px" }}>
          <h3>Total Courses</h3>
          <h2>{stats.totalCourses}</h2>
        </div>

        <div style={{ width: "200px", padding: "20px", background: "#fff3c9", borderRadius: "10px" }}>
          <h3>Pending Fees</h3>
          <h2>₹{stats.pendingFees}</h2>
        </div>

        <div style={{ width: "200px", padding: "20px", background: "#f5e8ff", borderRadius: "10px" }}>
          <h3>Attendance</h3>
          <h2>{stats.attendancePercentage.toFixed(1)}%</h2>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
