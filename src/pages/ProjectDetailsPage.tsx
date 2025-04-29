import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  Flag,
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { API_URL, TASK_STATUS, TASK_PRIORITY, VALIDATION_MESSAGES } from '../utils/constants';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
}

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState(TASK_STATUS.TODO);
  const [taskPriority, setTaskPriority] = useState(TASK_PRIORITY.MEDIUM);
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskErrors, setTaskErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project details
        const projectResponse = await axios.get(`${API_URL}/api/projects/${id}`);
        setProject(projectResponse.data);

        // Fetch tasks for this project
        const tasksResponse = await axios.get(`${API_URL}/api/projects/${id}/tasks`);
        setTasks(tasksResponse.data);
        setFilteredTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
    
    // Mock data for development
    setProject({
      _id: id || '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design principles and improved user experience.',
      createdAt: '2023-09-15T00:00:00.000Z',
    });
    
    setTasks([
      {
        _id: '101',
        title: 'Design Homepage Layout',
        description: 'Create wireframes and mockups for the new homepage design',
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.HIGH,
        dueDate: '2023-09-20',
        createdAt: '2023-09-15T00:00:00.000Z',
      },
      {
        _id: '102',
        title: 'Implement Responsive Navigation',
        description: 'Develop a responsive navigation menu that works well on all device sizes',
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '2023-09-25',
        createdAt: '2023-09-16T00:00:00.000Z',
      },
      {
        _id: '103',
        title: 'Content Migration',
        description: 'Transfer existing content to the new website structure',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.LOW,
        dueDate: '2023-10-05',
        createdAt: '2023-09-17T00:00:00.000Z',
      },
      {
        _id: '104',
        title: 'SEO Optimization',
        description: 'Implement SEO best practices across all pages',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '2023-10-10',
        createdAt: '2023-09-18T00:00:00.000Z',
      },
      {
        _id: '105',
        title: 'Performance Testing',
        description: 'Test website performance and optimize for speed',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.HIGH,
        dueDate: '2023-10-15',
        createdAt: '2023-09-19T00:00:00.000Z',
      },
    ]);
    setFilteredTasks([
      {
        _id: '101',
        title: 'Design Homepage Layout',
        description: 'Create wireframes and mockups for the new homepage design',
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.HIGH,
        dueDate: '2023-09-20',
        createdAt: '2023-09-15T00:00:00.000Z',
      },
      {
        _id: '102',
        title: 'Implement Responsive Navigation',
        description: 'Develop a responsive navigation menu that works well on all device sizes',
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '2023-09-25',
        createdAt: '2023-09-16T00:00:00.000Z',
      },
      {
        _id: '103',
        title: 'Content Migration',
        description: 'Transfer existing content to the new website structure',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.LOW,
        dueDate: '2023-10-05',
        createdAt: '2023-09-17T00:00:00.000Z',
      },
      {
        _id: '104',
        title: 'SEO Optimization',
        description: 'Implement SEO best practices across all pages',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '2023-10-10',
        createdAt: '2023-09-18T00:00:00.000Z',
      },
      {
        _id: '105',
        title: 'Performance Testing',
        description: 'Test website performance and optimize for speed',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.HIGH,
        dueDate: '2023-10-15',
        createdAt: '2023-09-19T00:00:00.000Z',
      },
    ]);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    // Apply filter to tasks
    if (activeFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === activeFilter));
    }
  }, [activeFilter, tasks]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      // Update task status in the database
      await axios.patch(`${API_URL}/api/tasks/${taskId}`, { status: newStatus });
      
      // Update task in the state
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      
      setTasks(updatedTasks);
      toast.success('Task status updated!');
      
      // Mock for development
      const updatedTasksList = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasksList);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const validateTaskForm = () => {
    const errors: { title?: string; description?: string } = {};
    
    if (!taskTitle) {
      errors.title = VALIDATION_MESSAGES.REQUIRED;
    } else if (taskTitle.length < 3) {
      errors.title = VALIDATION_MESSAGES.TASK_TITLE_MIN_LENGTH;
    } else if (taskTitle.length > 100) {
      errors.title = VALIDATION_MESSAGES.TASK_TITLE_MAX_LENGTH;
    }
    
    if (taskDescription && taskDescription.length > 500) {
      errors.description = VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH;
    }
    
    setTaskErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTaskForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate || null,
        projectId: id,
      };
      
      const response = await axios.post(`${API_URL}/api/tasks`, newTask);
      
      // Add the new task to the list
      setTasks([...tasks, response.data]);
      
      toast.success('Task created successfully!');
      closeTaskModal();
      
      // Mock for development
      const mockTask = {
        _id: String(Date.now()),
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate || null,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, mockTask]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create task. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTaskForm() || !selectedTask) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedTask = {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate || null,
      };
      
      await axios.put(`${API_URL}/api/tasks/${selectedTask._id}`, updatedTask);
      
      // Update the task in the list
      const updatedTasks = tasks.map(task => 
        task._id === selectedTask._id ? { ...task, ...updatedTask } : task
      );
      
      setTasks(updatedTasks);
      
      toast.success('Task updated successfully!');
      closeTaskModal();
      
      // Mock for development
      const updatedTasksList = tasks.map(task => 
        task._id === selectedTask._id ? { 
          ...task, 
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          priority: taskPriority,
          dueDate: taskDueDate || null,
        } : task
      );
      setTasks(updatedTasksList);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update task. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.delete(`${API_URL}/api/tasks/${selectedTask._id}`);
      
      // Remove the task from the list
      const updatedTasks = tasks.filter(task => task._id !== selectedTask._id);
      setTasks(updatedTasks);
      
      toast.success('Task deleted successfully!');
      closeDeleteTaskModal();
      
      // Mock for development
      const filteredTasks = tasks.filter(task => task._id !== selectedTask._id);
      setTasks(filteredTasks);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete task. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateTaskModal = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus(TASK_STATUS.TODO);
    setTaskPriority(TASK_PRIORITY.MEDIUM);
    setTaskDueDate('');
    setTaskErrors({});
    setIsEditing(false);
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate || '');
    setTaskErrors({});
    setIsEditing(true);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus(TASK_STATUS.TODO);
    setTaskPriority(TASK_PRIORITY.MEDIUM);
    setTaskDueDate('');
    setTaskErrors({});
    setIsEditing(false);
  };

  const openDeleteTaskModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteTaskModal(true);
  };

  const closeDeleteTaskModal = () => {
    setShowDeleteTaskModal(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return 'text-red-600 bg-red-50';
      case TASK_PRIORITY.MEDIUM:
        return 'text-yellow-600 bg-yellow-50';
      case TASK_PRIORITY.LOW:
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case TASK_STATUS.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case TASK_STATUS.TODO:
        return <XCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{error || 'Project not found'}</p>
        <Link to="/projects" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  const completedTasksCount = tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link to="/projects" className="mr-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        </div>
        <button
          onClick={openCreateTaskModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <p className="text-gray-500 mb-4">
              {project.description || 'No description provided.'}
            </p>
            <p className="text-sm text-gray-500">
              Created on {format(new Date(project.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg min-w-[200px]">
            <div className="text-center mb-2">
              <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{tasks.length} Tasks</span>
              <span>{completedTasksCount} Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          
          {/* Filter Options */}
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter(TASK_STATUS.TODO)}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === TASK_STATUS.TODO
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setActiveFilter(TASK_STATUS.IN_PROGRESS)}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === TASK_STATUS.IN_PROGRESS
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveFilter(TASK_STATUS.COMPLETED)}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === TASK_STATUS.COMPLETED
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-gray-500 mb-4">No tasks found{activeFilter !== 'all' ? ` with status "${activeFilter}"` : ''}.</p>
            <button
              onClick={openCreateTaskModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Task
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getStatusIcon(task.status)}</span>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value={TASK_STATUS.TODO}>To Do</option>
                            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                            <option value={TASK_STATUS.COMPLETED}>Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {task.dueDate ? (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </div>
                          ) : (
                            'No due date'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditTaskModal(task)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteTaskModal(task)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal (Create/Edit) */}
      {showTaskModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeTaskModal}></div>
          <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            
            <form onSubmit={isEditing ? handleUpdateTask : handleCreateTask}>
              <div className="mb-4">
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title*
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    taskErrors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {taskErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{taskErrors.title}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    taskErrors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                ></textarea>
                {taskErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{taskErrors.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="taskStatus"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={TASK_STATUS.TODO}>To Do</option>
                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="taskPriority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={TASK_PRIORITY.LOW}>Low</option>
                    <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                    <option value={TASK_PRIORITY.HIGH}>High</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="taskDueDate"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? isEditing ? 'Updating...' : 'Creating...'
                    : isEditing ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {showDeleteTaskModal && selectedTask && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeDeleteTaskModal}></div>
          <div className="relative bg-white w-full max-w-sm p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Task</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedTask.title}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDeleteTaskModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;