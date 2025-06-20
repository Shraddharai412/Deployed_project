// Routes/Taskroutes.js
const express = require('express');
const router = express.Router();
const Task = require('../Model/Tasks');

// Add new task
router.post('/', async (req, res) => {
    try {
        const newTask = new Task({ title: req.body.title });
        await newTask.save();
        res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a task
router.put('/updatetask/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(id, { title }, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
