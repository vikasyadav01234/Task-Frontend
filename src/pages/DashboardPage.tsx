import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface ProjectSummary {
  _id: string;
  name: string;
  taskCount: number;
  completedTaskCount: number;
}

interface TaskSummary {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dashboard`);
        setProjects(response.data.projects);
        setTaskSummary(response.data.taskSummary);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for development
  useEffect(() => {
    setProjects([
      {
        _id: '1',
        name: 'Website Redesign',
        taskCount: 12,
        completedTaskCount: 5,
      },
      {
        _id: '2',
        name: 'Mobile App Development',
        taskCount: 18,
        completedTaskCount: 7,
      },
      {
        _id: '3',
        name: 'Marketing Campaign',
        taskCount: 8,
        completedTaskCount: 2,
      },
    ]);

    setTaskSummary({
      total: 38,
      completed: 14,
      inProgress: 10,
      todo: 14,
    });

    setIsLoading(false);
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1 sm:mt-0">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <h3 className="text-xl font-semibold text-gray-900">{taskSummary.total}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <h3 className="text-xl font-semibold text-gray-900">{taskSummary.completed}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <h3 className="text-xl font-semibold text-gray-900">{taskSummary.inProgress}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">To Do</p>
              <h3 className="text-xl font-semibold text-gray-900">{taskSummary.todo}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
          <Link
            to="/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View All
          </Link>
        </div>
        
        {projects.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">You don't have any projects yet.</p>
            <Link
              to="/projects"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition group"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600">
                  {project.name}
                </h3>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{project.taskCount} Tasks</span>
                  <span>{Math.round((project.completedTaskCount / (project.taskCount || 1)) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.round((project.completedTaskCount / (project.taskCount || 1)) * 100)}%` }}
                  ></div>
                </div>
              </Link>
            ))}
            
            {projects.length < 4 && (
              <Link
                to="/projects"
                className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition"
              >
                <span className="text-2xl mb-2">+</span>
                <span className="text-sm font-medium">Add Project</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            <p>Activity tracking will be implemented in the next version.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;