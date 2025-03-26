import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Welcome to <span className="text-primary">WokeoMeter</span></h2>
      
      <div className="max-w-2xl mx-auto card">
        <p className="mb-6 text-dark-text">
          WokeoMeter helps you analyze the level of "wokeness" in TV shows, movies, and other media content.
          Answer a series of questions about the content you're analyzing, and get a score that categorizes
          the content on a scale from "Limited Wokeness" to "Egregiously Woke."
        </p>
        
        <p className="mb-8 text-dark-muted">
          All assessments are saved locally in your browser for future reference.
        </p>
        
        <div className="flex justify-center gap-6">
          <Link to="/new" className="btn btn-primary">Start New Assessment</Link>
          <Link to="/saved" className="btn btn-secondary">View Saved Assessments</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
