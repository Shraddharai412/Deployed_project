import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

function App() {
  const [formData, setFormData] = useState({ title: "" });
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      setErrors({ title: "Task title is required" });
      return;
    }

    try {
      if (editIndex === null) {
        await axios.post(`${API}/api/tasks`, { title: formData.title });
      } else {
        const taskId = tasks[editIndex]._id;
        await axios.put(`${API}/api/tasks/updatetask/${taskId}`, {
          title: formData.title,
        });
      }

      setFormData({ title: "" });
      setEditIndex(null);
      fetchTasks();
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  const handleEdit = (index) => {
    setFormData({ title: tasks[index].title });
    setEditIndex(index);
    setErrors({});
  };

  const handleDelete = async (index) => {
    try {
      const taskId = tasks[index]._id;
      await axios.delete(`${API}/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
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
    formGroup: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#333",
    },
    input: {
      padding: "10px 12px",
      fontSize: "16px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      outline: "none",
    },
    error: {
      color: "#dc3545",
      fontSize: "14px",
      marginTop: "5px",
    },
    button: {
      marginTop: "10px",
      backgroundColor: "purple",
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
      marginTop: "20px",
    },
    listItem: {
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
    emptyMessage: {
      textAlign: "center",
      fontStyle: "italic",
      color: "#555",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Todo List Manager</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Task
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.title && <p style={styles.error}>{errors.title}</p>}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: editIndex === null ? "purple" : "#6f42c1",
            }}
          >
            {editIndex === null ? "Add Task" : "Update Task"}
          </button>
        </form>

        {tasks.length === 0 ? (
          <p style={styles.emptyMessage}>No tasks added yet</p>
        ) : (
          <ul style={styles.taskList}>
            {tasks.map((task, index) => (
              <li key={index} style={styles.listItem}>
                <span>{task.title}</span>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleEdit(index)}
                    style={{ ...styles.button, backgroundColor: "green" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    style={{ ...styles.button, backgroundColor: "#dc3545" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
