import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">TaskFlow</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Simplify project management and task tracking
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-8">
            <div className="mt-4 sm:mt-0">
              <h3 className="text-sm font-medium text-gray-700">Resources</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-500 hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-sm text-gray-500 hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-sm text-gray-500 hover:text-blue-600">
                    Projects
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <h3 className="text-sm font-medium text-gray-700">Account</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-gray-500 hover:text-blue-600">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-sm text-gray-500 hover:text-blue-600">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 text-center">
            &copy; {year} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;