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
      <div className="text-center p-6 card">
        <p className="text-dark-muted mb-6">Assessment not found.</p>
        <button 
          onClick={() => navigate('/saved')} 
          className="btn btn-primary"
        >
          Back to Saved Assessments
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Assessment Details</h2>
      
      <div className="result-container">
        <div className="flex gap-6 mb-6">
          {assessment.showDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${assessment.showDetails.poster_path}`}
              alt={assessment.showName}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{assessment.showName}</h3>
            <div className="text-sm text-dark-muted mb-4">
              Assessed on {formatDate(assessment.date)}
            </div>
            
            {assessment.showDetails && (
              <div className="space-y-2 text-sm text-dark-muted mb-4">
                <p>
                  <span className="font-medium">Release Date:</span>{' '}
                  {assessment.showDetails.release_date || assessment.showDetails.first_air_date || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Rating:</span>{' '}
                  {assessment.showDetails.vote_average ? `${assessment.showDetails.vote_average.toFixed(1)}/10` : 'N/A'}
                </p>
                {assessment.showDetails.overview && (
                  <p className="line-clamp-3">
                    <span className="font-medium">Overview:</span>{' '}
                    {assessment.showDetails.overview}
                  </p>
                )}
              </div>
            )}
            
            <div className="result-score">{assessment.score}</div>
            <div className={`result-category ${getCategoryClass()}`}>
              {assessment.category}
            </div>
          </div>
        </div>
        
        <div className="mt-8 neoglass p-6">
          <h4 className="text-xl font-medium mb-6 text-primary">Assessment Questions</h4>
          
          <div className="text-left">
            {assessment.questions.map((question) => (
              <div key={question.id} className="mb-4 pb-4 border-b border-glass-border">
                <p className="font-medium mb-2">{question.text}</p>
                <p className={
                  question.answer === "Agree" || question.answer === "Strongly Agree" 
                  ? "text-category-very font-medium" 
                  : "text-dark-muted"
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
