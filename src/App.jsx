import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://yc8nam0dxi.execute-api.us-east-1.amazonaws.com/stage1"; // replace after deployment

function App() {
  const [bugs, setBugs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchBugs = async () => {
    const res = await axios.get(`${API_URL}/bugs`);
    setBugs(res.data);
  };

  const submitBug = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/bugs`, form);
    setForm({ title: "", description: "" });
    fetchBugs();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/bugs/${id}`, { status });
    fetchBugs();
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return (
    <div className="container">
      <h2>Bug Tracker Dashboard</h2>
      <form onSubmit={submitBug}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        ></textarea>
        <button type="submit">Submit Bug</button>
      </form>

      <h3>Bug List</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bugs) &&
            bugs.map((bug) => (
              <tr key={bug.id}>
                <td>{bug.title}</td>
                <td>{bug.description}</td>
                <td>
                  <select
                    value={bug.status}
                    className={
                      bug.status === "Open"
                        ? "status-open"
                        : bug.status === "In Progress"
                        ? "status-in-progress"
                        : bug.status === "Resolved"
                        ? "status-resolved"
                        : ""
                    }
                    onChange={(e) => updateStatus(bug.id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
