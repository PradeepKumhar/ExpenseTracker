import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome,FaSignInAlt, FaSignOutAlt,FaTachometerAlt } from 'react-icons/fa'; // Example icons
import { FaUserPlus } from 'react-icons/fa';  // This might work as an alternative


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // or sessionStorage depending on your choice
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    console.log('Logging out');
    
    localStorage.removeItem('token');
    sessionStorage.removeItem('token'); // Clear sessionStorage as well if applicable
    setIsAuthenticated(false);

    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold flex items-center">
          {/* <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" /> Optional logo */}
          Expense Tracker
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link
              to="/"
              className={`text-white text-lg hover:text-blue-300 flex items-center ${location.pathname === '/' ? 'font-bold' : ''}`}
            >
              <FaHome className="mr-2" /> Home
            </Link>
          </li>

          {/* Conditionally render links based on authentication status */}
          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/login"
                  className={`text-white text-lg hover:text-blue-300 flex items-center ${location.pathname === '/login' ? 'font-bold' : ''}`}
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`text-white text-lg hover:text-blue-300 flex items-center ${location.pathname === '/register' ? 'font-bold' : ''}`}
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`text-white text-lg hover:text-blue-300 flex items-center ${location.pathname === '/dashboard' ? 'font-bold' : ''}`}
                >
                  <FaTachometerAlt className="mr-2" /> Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white text-lg hover:text-blue-300 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
