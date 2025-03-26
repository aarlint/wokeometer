import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          <h1>WokeoMeter</h1>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/" className="text-white hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/new" className="text-white hover:underline">New Assessment</Link>
              </li>
              <li>
                <Link to="/saved" className="text-white hover:underline">Saved Assessments</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
