import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/login`
      }
    });
  };

  const AuthButton = () => {
    if (isAuthenticated) {
      return (
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card-hover transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-5 h-5" />
              )}
            </div>
          </button>
          
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-light-card dark:bg-dark-card rounded-lg shadow-lg border border-light-border dark:border-dark-border py-2 z-50">
              <div className="px-4 py-2 border-b border-light-border dark:border-dark-border">
                <p className="text-sm font-medium text-light-text dark:text-dark-text">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <button
        onClick={() => loginWithRedirect()}
        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
      >
        Login
      </button>
    );
  };

  return (
    <header className="header py-4 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Woke-O-Meter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link 
                    to="/" 
                    className={`text-light-text dark:text-dark-text hover:text-primary transition-colors ${
                      isActive('/') ? 'border-b-2 border-primary' : ''
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/new" 
                    className={`text-light-text dark:text-dark-text hover:text-primary transition-colors ${
                      isActive('/new') ? 'border-b-2 border-primary' : ''
                    }`}
                  >
                    New Assessment
                  </Link>
                </li>
              </ul>
            </nav>
            <AuthButton />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-card dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-card-hover border border-light-border dark:border-dark-border transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="w-5 h-5 text-light-text dark:text-dark-text" />
              ) : (
                <FaMoon className="w-5 h-5 text-light-text dark:text-dark-text" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <AuthButton />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-card dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-card-hover border border-light-border dark:border-dark-border transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="w-5 h-5 text-light-text dark:text-dark-text" />
              ) : (
                <FaMoon className="w-5 h-5 text-light-text dark:text-dark-text" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-light-card dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-card-hover border border-light-border dark:border-dark-border transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-5 h-5 text-light-text dark:text-dark-text" />
              ) : (
                <FaBars className="w-5 h-5 text-light-text dark:text-dark-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <nav>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    className={`block py-2 text-light-text dark:text-dark-text hover:text-primary transition-colors ${
                      isActive('/') ? 'border-l-4 border-primary' : ''
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/new" 
                    onClick={closeMobileMenu}
                    className={`block py-2 text-light-text dark:text-dark-text hover:text-primary transition-colors ${
                      isActive('/new') ? 'border-l-4 border-primary' : ''
                    }`}
                  >
                    New Assessment
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
