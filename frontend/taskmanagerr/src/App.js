import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null); // track task being edited

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (!title.trim()) return alert("Title cannot be empty");

    try {
      if (editId) {
        // Update existing task
        await axios.put(`${API}/api/tasks/updatetask/${editId}`, { title });
        setEditId(null); // reset after update
      } else {
        // Add new task
        await axios.post(`${API}/api/tasks`, { title });
      }

      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding/updating task:", err.response?.data || err.message);
      alert("Failed to process task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Task Manager</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Enter task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <button onClick={handleAddOrUpdateTask} style={{ padding: 10 }}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span>{task.title}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleEditTask(task)}
                style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: 5 }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: 5 }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
