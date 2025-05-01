import asyncHandler from 'express-async-handler';
import Project from '../model/Project.js';
import Task from '../model/Task.js';

// Create a new project
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a project name');
  }

  const userProjects = await Project.find({ userId: req.user.id });
  if (userProjects.length >= 4) {
    res.status(400);
    throw new Error('You have reached the maximum limit of 4 projects');
  }

  const project = await Project.create({
    name,
    description,
    userId: req.user.id,
  });

  res.status(201).json(project);
});

// Get all projects for a user
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user.id });

  const projectsWithStats = await Promise.all(projects.map(async (project) => {
    const projectTasks = await Task.find({ projectId: project._id });
    const completedTasks = projectTasks.filter(task => task.status === 'Completed');

    return {
      ...project._doc,
      taskCount: projectTasks.length,
      completedTaskCount: completedTasks.length,
    };
  }));

  res.json(projectsWithStats);
});

// Get a project by ID
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// Update a project
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

  if (project) {
    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    await project.save();
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// Delete a project
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

  if (project) {
    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
