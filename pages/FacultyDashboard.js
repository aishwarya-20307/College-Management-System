import React, { useEffect, useState } from "react";

const FacultyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setError("Unable to load dashboard"));
  }, []);

  if (error) return <p>{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Faculty Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-bold">Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-bold">Total Courses</h3>
          <p>{stats.totalCourses}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-bold">Pending Fees</h3>
          <p>{stats.pendingFees}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-bold">Avg Attendance</h3>
          <p>{stats.attendancePercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
