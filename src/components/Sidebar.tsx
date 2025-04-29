import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, User, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: <FolderKanban size={20} />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm transition-all duration-300">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md
                    ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                    transition-all duration-200
                  `}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {/* User initial */}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">User Name</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;