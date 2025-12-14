// src/components/Dashboard.js
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <ul className="space-y-2">
        <li>Total Students: {stats.totalStudents}</li>
        <li>Total Faculty: {stats.totalFaculty}</li>
        <li>Total Courses: {stats.totalCourses}</li>
        <li>Fees Pending: ₹{stats.feesPending}</li>
        <li>Attendance Percentage: {stats.attendancePercentage}%</li>
      </ul>
    </div>
  );
};

export default Dashboard;
