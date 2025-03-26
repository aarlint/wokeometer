import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2 className="page-title text-2xl font-bold mb-6">Welcome to WokeoMeter</h2>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          WokeoMeter helps you analyze the level of "wokeness" in TV shows, movies, and other media content.
          Answer a series of questions about the content you're analyzing, and get a score that categorizes
          the content on a scale from "Limited Wokeness" to "Egregiously Woke."
        </p>
        
        <p className="mb-6">
          All assessments are saved locally in your browser for future reference.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/new" className="btn btn-primary">Start New Assessment</Link>
          <Link to="/saved" className="btn btn-secondary">View Saved Assessments</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
