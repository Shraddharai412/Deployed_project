import React,{useState,useEffect} from "react";
import axios from "axios";

const API=process.env.REACT_APP_API;

function App(){
  const [title,setTitle]=useState("");
  const [tasks,setTasks]=useState([]);
 
  const fetchTasks=async()=>{
    try{
      const res=await axios.get(`${API}/api/tasks`);
      setTasks(res.data.tasks);
      
    }catch(err){
      console.error("Error fetching tasks:",err);
    }
  };
  const handleAddTask=async()=>{
    try{
      await axios.post(`${API}/api/tasks`, { title });
      setTitle("");
      fetchTasks();
    }
    catch{
      console.error("Error adding task");
      alert("Failed to add task");
    }

  
  };
  const handleDeleteTask=async(id)=>{
    
      await axios.delete(`${API}/api/tasks/${id}`);
      fetchTasks();
    
  };
  useEffect(()=>{
    fetchTasks();
  },[]);
  return(

    <div style={{padding : "20px"}}>
      <h1>Task Management App</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />
        <button  onClick={handleAddTask}>Add Task</button>
      </div>
      <ul >
        {tasks.map((task)=>(
          <li key={task._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            {task.title}  &nsbp;
            <button  onClick={()=>handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );

}
export default App;