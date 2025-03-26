import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header py-4">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              WokeoMeter
            </span>
          </Link>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link to="/" className="text-dark-text hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/new" className="text-dark-text hover:text-primary transition-colors">New Assessment</Link>
              </li>
              <li>
                <Link to="/saved" className="text-dark-text hover:text-primary transition-colors">Saved Assessments</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
