import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

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
    if (!title.trim()) return alert("Title cannot be empty");

    try {
      if (editId) {
        await axios.put(`${API}/api/tasks/updatetask/${editId}`, { title });
        setEditId(null);
      } else {
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

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to right, rgb(34, 41, 143) 10%, rgb(75, 17, 99) 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 30,
      width: "100%",
      maxWidth: 600,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    },
    heading: {
      textAlign: "center",
      color: " rgba(230, 15, 137, 0.94)",
      marginBottom: 30,
      fontSize: "24px",
    },
    formBox: {
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 20,
      marginBottom: 30,
      backgroundColor: "#f9f9f9",
    },
    inputGroup: {
      display: "flex",
      gap: 10,
    },
    input: {
      flex: 1,
      padding: 10,
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 16,
    },
    button: {
      padding: "10px 20px",
      borderRadius: 6,
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
      transition: "background 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    list: {
      listStyle: "none",
      padding: 0,
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      padding: "10px 15px",
      backgroundColor: "#f4f7fe",
      borderRadius: 8,
    },
    editButton: {
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: 5,
      marginRight: 8,
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: 5,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Task Manager</h2>

        <div style={styles.formBox}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Enter task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleAddOrUpdateTask} style={styles.button}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task._id} style={styles.listItem}>
              <span>{task.title}</span>
              <div>
                <button onClick={() => handleEditTask(task)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task._id)} style={styles.deleteButton}>
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
