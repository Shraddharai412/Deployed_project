import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (!title.trim()) return alert("Please enter a task");

    try {
      if (editId) {
        // update
        await axios.put(`${API}/api/tasks/updatetask/${editId}`, { title });
        setEditId(null);
      } else {
        // add new
        await axios.post(`${API}/api/tasks`, { title });
      }
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err.response?.data || err.message);
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

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 20px",
    },
    container: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "16px",
      maxWidth: "600px",
      width: "100%",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    },
    heading: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px",
    },
    inputGroup: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      fontSize: "16px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      outline: "none",
    },
    button: {
      backgroundColor: editId ? "#6f42c1" : "#f6a000",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    taskList: {
      listStyle: "none",
      padding: 0,
    },
    taskItem: {
      backgroundColor: "#fef5e7",
      padding: "12px 16px",
      borderRadius: "10px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
    },
    smallButton: {
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Task Management App</h1>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddOrUpdateTask} style={styles.button}>
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        <ul style={styles.taskList}>
          {tasks.map((task) => (
            <li key={task._id} style={styles.taskItem}>
              {task.title}
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => handleEditTask(task)}
                  style={{ ...styles.smallButton, backgroundColor: "green" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{ ...styles.smallButton, backgroundColor: "#dc3545" }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
