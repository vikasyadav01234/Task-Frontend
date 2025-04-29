import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <Sidebar />
        )}
        
        <main className={`flex-1 p-4 sm:p-6 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;