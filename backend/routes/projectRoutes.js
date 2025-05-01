import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js'; // assumes JWT middleware

const router = express.Router();

router.route('/')
  .post(protect, createProject)    // Create project
  .get(protect, getProjects);      // Get all projects

router.route('/:id')
  .get(protect, getProjectById)    // Get project by ID
  .put(protect, updateProject)     // Update project
  .delete(protect, deleteProject); // Delete project

export default router;
