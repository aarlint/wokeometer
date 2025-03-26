import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessment } from '../data';

const ViewAssessment = () => {
  const [assessment, setAssessment] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Convert id to number (since it comes from URL as string)
    const assessmentId = parseInt(id);
    
    // Get the assessment by ID
    const foundAssessment = getAssessment(assessmentId);
    
    if (foundAssessment) {
      setAssessment(foundAssessment);
    }
  }, [id]);
  
  const getCategoryClass = () => {
    if (!assessment) return "";
    
    if (assessment.category === "Limited Wokeness") return "category-limited";
    if (assessment.category === "Woke") return "category-woke";
    if (assessment.category === "Very Woke") return "category-very";
    if (assessment.category === "Egregiously Woke") return "category-egregiously";
    return "";
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (!assessment) {
    return (
      <div className="text-center p-6">
        <p>Assessment not found.</p>
        <button 
          onClick={() => navigate('/saved')} 
          className="btn btn-primary mt-4"
        >
          Back to Saved Assessments
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="page-title text-2xl font-bold">Assessment Details</h2>
      
      <div className="result-container">
        <h3 className="result-title">{assessment.showName}</h3>
        <div className="text-sm text-gray-500 mb-6">
          Assessed on {formatDate(assessment.date)}
        </div>
        
        <div className="result-score">{assessment.score}</div>
        
        <div className={`result-category ${getCategoryClass()}`}>
          {assessment.category}
        </div>
        
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-4">Assessment Questions</h4>
          
          <div className="text-left">
            {assessment.questions.map((question) => (
              <div key={question.id} className="mb-4 pb-4 border-b">
                <p className="font-medium">{question.text}</p>
                <p className={
                  question.answer === "Agree" || question.answer === "Strongly Agree" 
                  ? "text-red-600 font-medium" 
                  : "text-gray-600"
                }>
                  Answer: {question.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => navigate('/saved')} 
            className="btn btn-secondary"
          >
            Back to Saved Assessments
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAssessment;
