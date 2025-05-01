import asyncHandler from 'express-async-handler';
import Task from '../model/Task.js';
// Import mock data
import { getTasks } from './taskController.js';
import Project from '../model/Project.js';
// Mock projects data

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user's projects from DB
  const userProjects = await Project.find({ userId });

  // Get user's tasks from DB
  const userTasks = await Task.find({ userId });

  // Calculate project stats
  const projectsWithStats = userProjects.map(project => {
    const projectTasks = userTasks.filter(task => task.projectId.toString() === project._id.toString());
    const completedTasks = projectTasks.filter(task => task.status === 'Completed');

    return {
      _id: project._id,
      name: project.name,
      taskCount: projectTasks.length,
      completedTaskCount: completedTasks.length,
    };
  });

  // Task summary
  const taskSummary = {
    total: userTasks.length,
    completed: userTasks.filter(task => task.status === 'Completed').length,
    inProgress: userTasks.filter(task => task.status === 'In Progress').length,
    todo: userTasks.filter(task => task.status === 'Pending').length,
  };

  res.json({
    projects: projectsWithStats,
    taskSummary,
  });
});

export { getDashboardData };