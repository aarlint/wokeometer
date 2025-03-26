import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
                <li>
                  <Link 
                    to="/saved" 
                    className={`text-light-text dark:text-dark-text hover:text-primary transition-colors ${
                      isActive('/saved') ? 'border-b-2 border-primary' : ''
                    }`}
                  >
                    Saved Assessments
                  </Link>
                </li>
              </ul>
            </nav>
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
                <li>
                  <Link 
                    to="/saved" 
                    onClick={closeMobileMenu}
                    className={`block py-2 text-light-text dark:text-dark-text hover:text-primary transition-colors ${
                      isActive('/saved') ? 'border-l-4 border-primary' : ''
                    }`}
                  >
                    Saved Assessments
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
