import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data';

const NewAssessment = ({ setCurrentAssessment }) => {
  const [showName, setShowName] = useState('');
  const [showType, setShowType] = useState('');
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
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
      questionsPerPage,
      questions: [...QUESTIONS], // Copy questions with default answers
      currentPage: 1,
      totalPages: Math.ceil(QUESTIONS.length / questionsPerPage)
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
            <label className="text-dark-text font-medium mb-2">Questions Per Page:</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[3, 5, 10, 24].map(num => (
                <label 
                  key={num} 
                  className={`radio-label ${questionsPerPage === num ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="questionsPerPage"
                    value={num}
                    checked={questionsPerPage === num}
                    onChange={() => setQuestionsPerPage(num)}
                  />
                  <span>{num === 24 ? 'All Questions' : num}</span>
                </label>
              ))}
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
