import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data';

const NewAssessment = ({ setCurrentAssessment }) => {
  const [showName, setShowName] = useState('');
  const [showType, setShowType] = useState('');
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!showName.trim()) {
      alert('Please enter a show name');
      return;
    }
    
    // Create new assessment object
    const newAssessment = {
      showName,
      showType,
      questionsPerPage: showAllQuestions ? QUESTIONS.length : 1,
      questions: [...QUESTIONS], // Copy questions with default answers
      currentPage: 1,
      totalPages: showAllQuestions ? 1 : QUESTIONS.length
    };
    
    // Set the current assessment
    setCurrentAssessment(newAssessment);
    
    // Navigate to the assessment wizard
    navigate('/assessment');
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">New Assessment</h2>
      
      <div className="max-w-2xl mx-auto card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="showName" className="text-dark-text font-medium mb-2">Show/Movie Name:</label>
            <input
              type="text"
              id="showName"
              className="form-input"
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              required
              placeholder="Enter show or movie name"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="showType" className="text-dark-text font-medium mb-2">Type:</label>
            <select
              id="showType"
              className="form-input"
              value={showType}
              onChange={(e) => setShowType(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
              <option value="Web Series">Web Series</option>
              <option value="Documentary">Documentary</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="text-dark-text font-medium mb-2">Questions Display:</label>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">One question at a time</span>
              <label className="relative inline-flex items-center cursor-pointer mx-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showAllQuestions}
                  onChange={() => setShowAllQuestions(!showAllQuestions)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm">All questions at once</span>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary self-start">
            Start Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAssessment;
