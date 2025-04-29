import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL, MAX_PROJECTS_PER_USER, VALIDATION_MESSAGES } from '../utils/constants';

interface Project {
  _id: string;
  name: string;
  description: string;
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectNameError, setProjectNameError] = useState('');
  const [projectDescriptionError, setProjectDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
    
    // Mock data for development
    setProjects([
      {
        _id: '1',
        name: 'Website Redesign',
        description: 'Complete overhaul of the company website with modern design',
        taskCount: 12,
        completedTaskCount: 5,
        createdAt: '2023-09-15T00:00:00.000Z',
      },
      {
        _id: '2',
        name: 'Mobile App Development',
        description: 'Creating a native mobile app for iOS and Android platforms',
        taskCount: 18,
        completedTaskCount: 7,
        createdAt: '2023-08-20T00:00:00.000Z',
      },
      {
        _id: '3',
        name: 'Marketing Campaign',
        description: 'Q4 marketing campaign for product launch',
        taskCount: 8,
        completedTaskCount: 2,
        createdAt: '2023-10-01T00:00:00.000Z',
      },
    ]);
    setIsLoading(false);
  }, []);

  const validateProjectForm = () => {
    let isValid = true;
    
    if (!projectName) {
      setProjectNameError(VALIDATION_MESSAGES.REQUIRED);
      isValid = false;
    } else if (projectName.length < 3) {
      setProjectNameError(VALIDATION_MESSAGES.PROJECT_NAME_MIN_LENGTH);
      isValid = false;
    } else if (projectName.length > 50) {
      setProjectNameError(VALIDATION_MESSAGES.PROJECT_NAME_MAX_LENGTH);
      isValid = false;
    } else {
      setProjectNameError('');
    }
    
    if (projectDescription.length > 500) {
      setProjectDescriptionError(VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH);
      isValid = false;
    } else {
      setProjectDescriptionError('');
    }
    
    return isValid;
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProjectForm()) {
      return;
    }
    
    if (projects.length >= MAX_PROJECTS_PER_USER) {
      toast.error(`You can only create up to ${MAX_PROJECTS_PER_USER} projects.`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/projects`, {
        name: projectName,
        description: projectDescription,
      });
      
      // Add the new project to the list
      setProjects([...projects, response.data]);
      
      toast.success('Project created successfully!');
      closeCreateModal();
      
      // Mock for development
      const newProject = {
        _id: String(Date.now()),
        name: projectName,
        description: projectDescription,
        taskCount: 0,
        completedTaskCount: 0,
        createdAt: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create project. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.delete(`${API_URL}/api/projects/${selectedProject._id}`);
      
      // Remove the deleted project from the list
      setProjects(projects.filter(project => project._id !== selectedProject._id));
      
      toast.success('Project deleted successfully!');
      closeDeleteModal();
      
      // Mock for development
      setProjects(projects.filter(project => project._id !== selectedProject._id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete project. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectNameError('');
    setProjectDescriptionError('');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setProjectName('');
    setProjectDescription('');
    setProjectNameError('');
    setProjectDescriptionError('');
  };

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {projects.length < MAX_PROJECTS_PER_USER && (
          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first project</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openDeleteModal(project)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{project.taskCount} Tasks</span>
                  <span>
                    {Math.round((project.completedTaskCount / (project.taskCount || 1)) * 100)}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.round((project.completedTaskCount / (project.taskCount || 1)) * 100)}%` }}
                  ></div>
                </div>
                
                <Link
                  to={`/projects/${project._id}`}
                  className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeCreateModal}></div>
          <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Project</h2>
            
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name*
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    projectNameError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {projectNameError && (
                  <p className="mt-1 text-sm text-red-600">{projectNameError}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    projectDescriptionError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                ></textarea>
                {projectDescriptionError && (
                  <p className="mt-1 text-sm text-red-600">{projectDescriptionError}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeDeleteModal}></div>
          <div className="relative bg-white w-full max-w-sm p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Project</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedProject.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;