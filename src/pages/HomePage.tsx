import { Link } from 'react-router-dom';
import { CheckCircle, Clock, List, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <List className="h-8 w-8 text-blue-600" />,
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease. Set priorities, due dates, and categorize tasks by projects.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your progress on each task and project. Get a visual representation of your productivity over time.',
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Time Management',
      description: 'Set deadlines and reminders to ensure you never miss an important task or deadline again.',
    },
    {
      icon: <Monitor className="h-8 w-8 text-blue-600" />,
      title: 'Multiple Projects',
      description: 'Manage up to 4 different projects, each with their own set of tasks and deadlines.',
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your <span className="text-blue-600">Tasks</span> and <span className="text-blue-600">Projects</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl">
            TaskFlow helps you manage your projects and tasks efficiently. 
            Stay organized, track progress, and achieve your goals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              TaskFlow offers everything you need to manage your projects and tasks efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Organized?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start managing your tasks and projects more efficiently today.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-md transition"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Create Your Account'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;