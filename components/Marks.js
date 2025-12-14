import React, { useEffect, useState } from "react";

const Marks = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/marks?email=${user.email}`)
        .then(res => res.json())
        .then(data => setMarks(data));
    }
  }, [user]);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Your Marks</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Course</th>
            <th>Internal</th>
            <th>Final</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m, index) => (
            <tr key={index}>
              <td>{m.course}</td>
              <td>{m.internal}</td>
              <td>{m.final}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marks;
