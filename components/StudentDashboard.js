import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [marks, setMarks] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if(!email) {
      navigate('/');
    } else {
      fetchMarks();
    }
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/marks/${email}`);
      setMarks(res.data.marks || []);
    } catch(err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Your Marks</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Course</th>
            <th>Internal</th>
            <th>Final</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m, idx) => (
            <tr key={idx}>
              <td>{m.course}</td>
              <td>{m.internal}</td>
              <td>{m.final}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
// src/components/StudentDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Student Dashboard</h1>
      {user ? (
        <>
          <p>Hello, <strong>{user.email}</strong>! You are logged in.</p>
          <button
            onClick={handleLogout}
            style={{ padding: "10px 20px", marginTop: "20px" }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default StudentDashboard;