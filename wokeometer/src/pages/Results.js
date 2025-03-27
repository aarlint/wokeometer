import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateScore, getWokenessCategory } from '../data';
import { saveAssessment } from '../lib/supabase-db';

const Results = ({ currentAssessment, setCurrentAssessment }) => {
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Calculate the score
    const calculatedScore = calculateScore(currentAssessment.questions);
    setScore(calculatedScore);
    
    // Determine the category
    const wokeCategory = getWokenessCategory(calculatedScore);
    setCategory(wokeCategory);
  }, [currentAssessment]);
  
  const getCategoryClass = () => {
    if (category === "Limited Wokeness") return "category-limited";
    if (category === "Woke") return "category-woke";
    if (category === "Very Woke") return "category-very";
    if (category === "Egregiously Woke") return "category-egregiously";
    return "";
  };
  
  const handleSave = async () => {
    try {
      setError(null);
      // Save the assessment
      await saveAssessment(
        currentAssessment.showName,
        currentAssessment.questions,
        score,
        category,
        currentAssessment.showDetails
      );
      
      setIsSaved(true);
    } catch (err) {
      setError('Failed to save assessment. Please try again.');
      console.error('Error saving assessment:', err);
    }
  };
  
  const handleNewAssessment = () => {
    // Reset the current assessment
    setCurrentAssessment(null);
    
    // Navigate to the new assessment page
    navigate('/new');
  };
  
  const handleViewSaved = () => {
    // Navigate to the saved assessments page
    navigate('/saved');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-3xl font-bold text-center mb-8">
          Results for: <span className="text-primary">{currentAssessment.showName}</span>
          {currentAssessment.showType && ` (${currentAssessment.showType})`}
        </h2>
        
        <div className="text-center mb-8">
          <div className={`text-5xl font-bold mb-2 ${getCategoryClass()}`}>
            {score.toFixed(1)}
          </div>
          <div className={`text-2xl font-medium ${getCategoryClass()}`}>
            {category}
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          {!isSaved ? (
            <button onClick={handleSave} className="btn btn-primary">
              Save Assessment
            </button>
          ) : (
            <div className="text-category-limited font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Assessment saved!
            </div>
          )}
          {error && (
            <div className="text-red-500 font-medium">
              {error}
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 neoglass">
          <h4 className="text-lg font-medium mb-4">What does this mean?</h4>
          <p className="mb-4 text-dark-text">
            {category === "Limited Wokeness" && "This content contains minimal woke elements and can be enjoyed without much concern for ideological messaging."}
            {category === "Woke" && "This content contains noticeable woke elements and themes that may impact your viewing experience."}
            {category === "Very Woke" && "This content contains significant woke messaging and themes that are central to the viewing experience."}
            {category === "Egregiously Woke" && "This content is dominated by woke ideology and messaging, which is likely to be distracting or off-putting for viewers who don't share these views."}
          </p>
        </div>
        
        <div className="flex justify-center gap-6 mt-8">
          <button onClick={handleNewAssessment} className="btn btn-secondary">
            New Assessment
          </button>
          <button onClick={handleViewSaved} className="btn btn-secondary">
            View Saved Assessments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
