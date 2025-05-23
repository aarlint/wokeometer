import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaFistRaised } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Main Content with Visual Separation */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-b-4 border-primary">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            {/* Header */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Welcome to Woke-O-Meter
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto">
              Woke-O-Meter is the world's premier media content assessment tool designed to shed light on the ever-increasing presence of woke material in the TV and Film industry. We crowdsource assessments provided by trustworthy viewers like you to gauge the "wokeness" of today's television and film productions.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/new"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                <FaPlay className="w-5 h-5" />
                Start an Assessment
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                <FaInfoCircle className="w-5 h-5" />
                Learn More
              </Link>
              
              <Link
                to="/donate"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                <FaFistRaised className="w-5 h-5" />
                Join The Fight
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Content Area */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlay className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Submit Assessment</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Rate your favorite shows and movies to help others make informed viewing decisions.
            </p>
            <Link
              to="/new"
              className="text-primary hover:text-primary-hover font-semibold"
            >
              Get Started →
            </Link>
          </div>
          
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaInfoCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Learn About Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Discover how we're working to bring transparency to entertainment media content.
            </p>
            <Link
              to="/about"
              className="text-primary hover:text-primary-hover font-semibold"
            >
              Read More →
            </Link>
          </div>
          
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-red-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFistRaised className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Support Our Cause</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Help us maintain an independent platform through anonymous Bitcoin donations.
            </p>
            <Link
              to="/donate"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Donate Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 