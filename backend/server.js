const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const taskRoutes = require('./Routes/Taskroutes');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

    app.use('api/tasks',taskRoutes);

    app.get('/', (req, res) => {
        res.send('Welcome to the Task Management API');
    });

    const PORT=process.env.PORT || 5000;
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })