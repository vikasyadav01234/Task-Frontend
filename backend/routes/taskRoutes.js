import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTask)    // Create task
  .get(protect, getTasks);      // Get all tasks for user

router.route('/:id')
  .put(protect, updateTask)     // Update task
  .delete(protect, deleteTask); // Delete task

export default router;
