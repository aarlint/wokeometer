import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          About Woke-O-Meter
        </h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Woke-O-Meter is dedicated to providing transparency in entertainment media by crowdsourcing assessments 
            of ideological content in television shows and films. Our platform empowers viewers to make informed 
            decisions about their entertainment choices based on community-driven evaluations.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our assessment system evaluates content across multiple categories of ideological themes. Users rate 
            shows and movies based on the presence of various elements, and our algorithm calculates an overall 
            "wokeness" score based on community input.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Assessment Categories</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our comprehensive assessment covers themes related to social justice, political messaging, representation, 
            and cultural commentary. Each element is weighted based on its significance and impact on the overall 
            viewing experience.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Scoring System</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Wokeness Levels:</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                <span className="text-green-700 dark:text-green-400 font-medium">Limited Wokeness</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">(0-20 points)</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></span>
                <span className="text-yellow-700 dark:text-yellow-400 font-medium">Woke</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">(21-40 points)</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-orange-500 rounded-full mr-3"></span>
                <span className="text-orange-700 dark:text-orange-400 font-medium">Very Woke</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">(41-60 points)</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
                <span className="text-red-700 dark:text-red-400 font-medium">Egregiously Woke</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">(60+ points)</span>
              </li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Community Guidelines</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We encourage honest, thoughtful assessments based on actual content viewing. Our platform relies on 
            the integrity of our community to provide accurate evaluations that help fellow viewers make informed decisions.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Privacy & Anonymity</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We are committed to protecting user privacy. Our platform supports anonymous participation, and we accept 
            only anonymous Bitcoin donations to maintain our independence and protect our supporters.
          </p>
          
          <div className="text-center mt-8">
            <Link
              to="/new"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold"
            >
              Start Your First Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 