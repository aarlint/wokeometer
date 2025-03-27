import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, CATEGORIES, calculateScore, getWokenessCategory, saveAssessment } from '../data';
import { useCurrentUserId } from '../lib/supabase-db';
import StackedIcon from '../components/StackedIcon';
import QuestionIconCard from '../components/QuestionIconCard';

const Results = ({ currentAssessment, setCurrentAssessment }) => {
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  
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
      
      // Ensure we have all required data
      if (!currentAssessment || !currentAssessment.showName || !currentAssessment.questions) {
        throw new Error('Missing required assessment data');
      }

      // Filter out unanswered questions and only keep id and answer
      const answeredQuestions = currentAssessment.questions
        .filter(q => q.answer && q.answer !== "" && q.answer !== "N/A")
        .map(q => ({
          id: q.id,
          answer: q.answer
        }));

      // Create a clean assessment object
      const assessmentToSave = {
        showName: currentAssessment.showName,
        questions: answeredQuestions,
        category,
        showDetails: currentAssessment.showDetails || null
      };

      // Save the assessment
      await saveAssessment(
        userId,
        assessmentToSave.showName,
        assessmentToSave.questions,
        assessmentToSave.category,
        assessmentToSave.showDetails
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
    // Navigate to the home catalog
    navigate('/');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-3xl font-bold text-center mb-8">
          Assessment Results for: <span className="text-primary">{currentAssessment.showName}</span>
          {currentAssessment.showType && ` (${currentAssessment.showType})`}
        </h2>
        
        <div className="flex gap-6 mb-8">
          {currentAssessment.showDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${currentAssessment.showDetails.poster_path}`}
              alt={currentAssessment.showName}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            {currentAssessment.showDetails && (
              <div className="space-y-2 text-sm text-dark-muted mb-4">
                <p>
                  <span className="font-medium">Release Date:</span>{' '}
                  {currentAssessment.showDetails.release_date || currentAssessment.showDetails.first_air_date || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Rating:</span>{' '}
                  {currentAssessment.showDetails.vote_average ? `${currentAssessment.showDetails.vote_average.toFixed(1)}/10` : 'N/A'}
                </p>
                {currentAssessment.showDetails.overview && (
                  <p className="line-clamp-3">
                    <span className="font-medium">Overview:</span>{' '}
                    {currentAssessment.showDetails.overview}
                  </p>
                )}
              </div>
            )}
            
            <div className="text-4xl font-bold mb-2">{score}</div>
            <div className={`text-xl font-medium ${getCategoryClass()}`}>
              {category}
            </div>
          </div>
        </div>
        
        <div className="mt-8 neoglass p-6">
          <h4 className="text-xl font-medium mb-6 text-primary">Woke Elements</h4>
          
          <div className="text-left">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentAssessment.questions
                .filter(q => q.answer === "Yes")
                .map((question) => (
                  <QuestionIconCard
                    key={question.id}
                    question={question}
                    size="medium"
                    interactive={false}
                  />
                ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          {!isSaved ? (
            <button 
              onClick={handleSave} 
              className="btn btn-primary flex-1"
            >
              Save Assessment
            </button>
          ) : (
            <button 
              onClick={handleViewSaved} 
              className="btn btn-primary flex-1"
            >
              View Saved Assessments
            </button>
          )}
          <button 
            onClick={handleNewAssessment} 
            className="btn btn-secondary flex-1"
          >
            New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
