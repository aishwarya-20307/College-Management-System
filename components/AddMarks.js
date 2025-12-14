// src/components/AddMarks.js
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AddMarks = () => {
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [internal, setInternal] = useState("");
  const [final, setFinal] = useState("");
  const [allMarks, setAllMarks] = useState([]);

  // Fetch all students' marks
  const fetchAllMarks = async () => {
    try {
      const res = await fetch("http://localhost:5000/all-marks");
      const data = await res.json();
      setAllMarks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch marks");
    }
  };

  useEffect(() => {
    fetchAllMarks();
  }, []);

  const handleAddMarks = async (e) => {
    e.preventDefault();

    // Validations
    if (!email || !course || internal === "" || final === "") {
      toast.error("All fields are required");
      return;
    }
    if (internal < 0 || final < 0) {
      toast.error("Marks cannot be negative");
      return;
    }
    if (internal > 50 || final > 100) {
      toast.error("Internal max 50, Final max 100");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, course, internal, final }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Marks added successfully!");
        setEmail("");
        setCourse("");
        setInternal("");
        setFinal("");
        fetchAllMarks(); // refresh table
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Marks</h2>

      <form className="space-y-4 max-w-md mb-6" onSubmit={handleAddMarks}>
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Internal Marks"
          min="0"
          max="50"
          value={internal}
          onChange={(e) => setInternal(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Final Marks"
          min="0"
          max="100"
          value={final}
          onChange={(e) => setFinal(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Marks
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">All Students Marks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Course</th>
              <th className="py-2 px-4">Internal</th>
              <th className="py-2 px-4">Final</th>
            </tr>
          </thead>
          <tbody>
            {allMarks.map((mark, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{mark.email}</td>
                <td className="py-2 px-4">{mark.course}</td>
                <td className="py-2 px-4">{mark.internal}</td>
                <td className="py-2 px-4">{mark.final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddMarks;
