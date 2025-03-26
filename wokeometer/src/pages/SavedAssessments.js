import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadAssessments } from '../data';

const SavedAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load saved assessments
    const savedAssessments = loadAssessments();
    setAssessments(savedAssessments);
  }, []);
  
  const getCategoryClass = (category) => {
    if (category === "Limited Wokeness") return "text-category-limited";
    if (category === "Woke") return "text-category-woke";
    if (category === "Very Woke") return "text-category-very";
    if (category === "Egregiously Woke") return "text-category-egregiously font-bold";
    return "";
  };
  
  const handleViewAssessment = (id) => {
    navigate(`/view/${id}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Saved Assessments</h2>
      
      {assessments.length === 0 ? (
        <div className="text-center card">
          <p className="text-dark-muted mb-6">No saved assessments found.</p>
          <button 
            onClick={() => navigate('/new')} 
            className="btn btn-primary"
          >
            Create New Assessment
          </button>
        </div>
      ) : (
        <div>
          {assessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="assessment-card"
              onClick={() => handleViewAssessment(assessment.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{assessment.showName}</h3>
                <span className={`font-medium ${getCategoryClass(assessment.category)}`}>
                  {assessment.score} ({assessment.category})
                </span>
              </div>
              <div className="text-sm text-dark-muted">
                {formatDate(assessment.date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAssessments;
