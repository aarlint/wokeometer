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
    if (category === "Limited Wokeness") return "text-green-600";
    if (category === "Woke") return "text-yellow-600";
    if (category === "Very Woke") return "text-red-500";
    if (category === "Egregiously Woke") return "text-red-700 font-bold";
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
      <h2 className="page-title text-2xl font-bold">Saved Assessments</h2>
      
      {assessments.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">No saved assessments found.</p>
          <button 
            onClick={() => navigate('/new')} 
            className="btn btn-primary mt-4"
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
              <div className="assessment-header">
                <h3 className="assessment-title">{assessment.showName}</h3>
                <span className={`assessment-score ${getCategoryClass(assessment.category)}`}>
                  {assessment.score} ({assessment.category})
                </span>
              </div>
              <div className="text-sm text-gray-500">
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
