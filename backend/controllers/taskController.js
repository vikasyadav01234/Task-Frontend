import asyncHandler from 'express-async-handler';
import Task from '../model/Task.js';

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, projectId } = req.body;

  if (!title || !projectId) {
    res.status(400);
    throw new Error('Title and Project ID are required');
  }

  const task = await Task.create({
    title,
    description,
    status,
    userId: req.user.id,
    projectId,
  });

  res.status(201).json(task);
});

// Get all tasks for a user
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

  if (task) {
    const { title, description, status, completedAt } = req.body;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.completedAt = completedAt || task.completedAt;

    await task.save();
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export { createTask, getTasks, updateTask, deleteTask };
