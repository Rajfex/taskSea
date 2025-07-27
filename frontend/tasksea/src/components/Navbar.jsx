import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
                clipRule="evenodd" 
              />
            </svg>
            Task Sea
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/tasks" className="hover:text-blue-200">Browse Tasks</Link>
            
            {user ? (
              <>
                <Link to="/post-task" className="hover:text-blue-200">Post Task</Link>
                <Link to="/my-tasks" className="hover:text-blue-200">My Tasks</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200 bg-purple-500 px-3 py-1 rounded">
                    Admin Panel
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center hover:text-blue-200">
                    {user.name}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                    <button 
                      onClick={logout}
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white w-full text-left"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
