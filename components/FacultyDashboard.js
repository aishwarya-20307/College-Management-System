import React from "react";

const FacultyDashboard = ({ user }) => {
  return (
    <div style={{ maxWidth: "800px", margin: "30px auto" }}>
      <h2>Welcome, {user.facultyId}</h2>
      <p>This is the faculty dashboard.</p>
    </div>
  );
};

export default FacultyDashboard;
