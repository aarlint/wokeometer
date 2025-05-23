import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { calculateScore, getWokenessCategory, saveAssessment } from '../data';
import { useCurrentUserId } from '../lib/supabase-db';
import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';

const Results = ({ currentAssessment, setCurrentAssessment }) => {
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useCurrentUserId();
  
  // Check for developer flag in URL
  const urlParams = new URLSearchParams(location.search);
  const isDevMode = urlParams.get('devflag') === 'true';
  
  useEffect(() => {
    // Calculate the score
    const calculatedScore = calculateScore(currentAssessment.questions);
    setScore(calculatedScore);
    
    // Determine the category
    const wokeCategory = getWokenessCategory(calculatedScore);
    setCategory(wokeCategory);
  }, [currentAssessment]);
  
  const getCategoryClass = () => {
    if (category === "Based") return "category-based";
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
    // Navigate to the saved assessments page
    navigate('/saved');
  };

  // Group answered questions by response type
  const getAnsweredQuestions = () => {
    return {
      stronglyAgree: currentAssessment.questions.filter(q => q.answer === "Strongly Agree"),
      agree: currentAssessment.questions.filter(q => q.answer === "Agree"),
      disagree: currentAssessment.questions.filter(q => q.answer === "Disagree"),
      // Include legacy "Yes" answers as "Strongly Agree" for backward compatibility
      legacy: currentAssessment.questions.filter(q => q.answer === "Yes")
    };
  };

  const answeredQuestions = getAnsweredQuestions();
  const totalAnswered = answeredQuestions.stronglyAgree.length + 
                       answeredQuestions.agree.length + 
                       answeredQuestions.disagree.length + 
                       answeredQuestions.legacy.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Assessment Complete
        </h2>
        <p className="text-xl text-primary font-semibold">
          {currentAssessment.showName}
          {currentAssessment.showType && ` (${currentAssessment.showType})`}
        </p>
      </div>

      {/* Show Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="flex gap-6">
          {currentAssessment.showDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${currentAssessment.showDetails.poster_path}`}
              alt={currentAssessment.showName}
              className="w-32 h-48 object-cover rounded-lg shadow-md flex-shrink-0"
            />
          )}
          <div className="flex-1">
            {currentAssessment.showDetails && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>
                  <span className="font-medium">Release Date:</span>{' '}
                  {currentAssessment.showDetails.release_date 
                    ? new Date(currentAssessment.showDetails.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : currentAssessment.showDetails.first_air_date 
                    ? new Date(currentAssessment.showDetails.first_air_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Rating:</span>{' '}
                  {currentAssessment.showDetails.vote_average 
                    ? `${currentAssessment.showDetails.vote_average.toFixed(1)}/10 (TMDB)` 
                    : 'N/A'}
                </p>
                {currentAssessment.showDetails.overview && (
                  <p className="line-clamp-3">
                    <span className="font-medium">Overview:</span>{' '}
                    {currentAssessment.showDetails.overview}
                  </p>
                )}
              </div>
            )}
            
            {/* Score Display - Hidden for regular users, shown with dev flag */}
            {isDevMode ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaEye className="text-primary" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Developer Mode - Scores Visible</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{score}</div>
                <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getCategoryClass()}`}>
                  {category}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaEyeSlash className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assessment scores are hidden</span>
                </div>
                <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  Assessment Completed
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {totalAnswered} questions answered
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FaInfoCircle className="text-primary" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assessment Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Woke Elements */}
          {(answeredQuestions.stronglyAgree.length > 0 || answeredQuestions.legacy.length > 0) && (
            <div className="space-y-3">
              <h4 className="font-medium text-red-700 dark:text-red-400 text-lg">
                Strongly Woke Elements ({answeredQuestions.stronglyAgree.length + answeredQuestions.legacy.length})
              </h4>
              <div className="space-y-2">
                {[...answeredQuestions.stronglyAgree, ...answeredQuestions.legacy].map((question) => (
                  <div key={question.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-red-600 dark:text-red-400">Weight: {question.weight}</span>
                      <span className="text-xs text-red-600 dark:text-red-400">•</span>
                      <span className="text-xs text-red-600 dark:text-red-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Moderate Woke Elements */}
          {answeredQuestions.agree.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-400 text-lg">
                Moderate Woke Elements ({answeredQuestions.agree.length})
              </h4>
              <div className="space-y-2">
                {answeredQuestions.agree.map((question) => (
                  <div key={question.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">Weight: {question.weight}</span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">•</span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Woke Elements */}
          {answeredQuestions.disagree.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-green-700 dark:text-green-400 text-lg">
                Non-Woke Elements ({answeredQuestions.disagree.length})
              </h4>
              <div className="space-y-2">
                {answeredQuestions.disagree.map((question) => (
                  <div key={question.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-600 dark:text-green-400">Weight: {question.weight}</span>
                      <span className="text-xs text-green-600 dark:text-green-400">•</span>
                      <span className="text-xs text-green-600 dark:text-green-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {!isSaved ? (
            <button 
              onClick={handleSave} 
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              Save Assessment
            </button>
          ) : (
            <button 
              onClick={handleViewSaved} 
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              View Saved Assessments
            </button>
          )}
          <button 
            onClick={handleNewAssessment} 
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
