// Base API URL
export const API_URL = 'https://backend-task-vkn7.onrender.com';

// Task Status Options
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

// Task Priority Options
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Maximum projects per user
export const MAX_PROJECTS_PER_USER = 4;

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  PASSWORD_MATCH: 'Passwords do not match',
  PROJECT_NAME_MIN_LENGTH: 'Project name must be at least 3 characters long',
  PROJECT_NAME_MAX_LENGTH: 'Project name cannot exceed 50 characters',
  TASK_TITLE_MIN_LENGTH: 'Task title must be at least 3 characters long',
  TASK_TITLE_MAX_LENGTH: 'Task title cannot exceed 100 characters',
  DESCRIPTION_MAX_LENGTH: 'Description cannot exceed 500 characters',
};