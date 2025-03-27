import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANSWER_OPTIONS, ANSWER_OPTIONS_LAYOUT, calculateScore, getWokenessCategory, saveAssessment } from '../data';

const AssessmentWizard = ({ currentAssessment, setCurrentAssessment, onFinish }) => {
  const [currentPage, setCurrentPage] = useState(currentAssessment.currentPage);
  const [hasAttemptedFinish, setHasAttemptedFinish] = useState(false);
  const navigate = useNavigate();
  
  const questionsPerPage = currentAssessment.questionsPerPage;
  const totalPages = currentAssessment.totalPages;
  
  // Calculate which questions to show on the current page
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, currentAssessment.questions.length);
  const currentQuestions = currentAssessment.questions.slice(startIndex, endIndex);
  
  // Update assessment when changing pages
  useEffect(() => {
    setCurrentAssessment({
      ...currentAssessment,
      currentPage
    });
  }, [currentPage]);

  // Add keyboard shortcuts for answering questions
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only process number keys 1-5
      if (e.key >= '1' && e.key <= '5') {
        const numKey = parseInt(e.key);
        
        // Check if we have a focused/active question
        const activeElement = document.activeElement;
        let questionId = null;
        
        if (activeElement && activeElement.name && activeElement.name.startsWith('question-')) {
          questionId = parseInt(activeElement.name.replace('question-', ''));
        } else if (currentQuestions.length > 0) {
          // If no question is focused, use the first question on the page
          questionId = currentQuestions[0].id;
        }
        
        // If we have a valid question, set its answer based on the key pressed
        if (questionId && numKey <= ANSWER_OPTIONS.length) {
          handleAnswerChange(questionId, ANSWER_OPTIONS[numKey - 1]);
          
          // Focus the next question if available
          const currentIndex = currentQuestions.findIndex(q => q.id === questionId);
          if (currentIndex < currentQuestions.length - 1) {
            const nextQuestionId = currentQuestions[currentIndex + 1].id;
            const nextInput = document.querySelector(`[name=question-${nextQuestionId}]`);
            if (nextInput) {
              nextInput.focus();
            }
          }
        }
      } else if (e.key === 'Enter' && canProceed()) {
        // Enter key to proceed to next page
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentQuestions, ANSWER_OPTIONS.length]);
  
  const handleAnswerChange = (questionId, answer) => {
    const updatedQuestions = currentAssessment.questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    );
    
    setCurrentAssessment({
      ...currentAssessment,
      questions: updatedQuestions
    });
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // If we're on the last page, check if we can proceed
      if (!canProceed()) {
        setHasAttemptedFinish(true);
        return;
      }
      
      // If we can proceed, calculate results and save
      const score = calculateScore(currentAssessment.questions);
      const category = getWokenessCategory(score);
      
      if (onFinish) {
        // If we have an onFinish handler, use it (for editing)
        onFinish();
      } else {
        // Otherwise just navigate to results
        navigate('/results');
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const canProceed = () => {
    // Check if all questions across all pages have been answered
    return currentAssessment.questions.every(q => q.answer !== "");
  };

  const getUnansweredCount = () => {
    return currentAssessment.questions.filter(q => q.answer === "").length;
  };

  // Handle clicking on the entire label
  const handleLabelClick = (questionId, option) => {
    handleAnswerChange(questionId, option);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-dark-text">
        {onFinish ? 'Editing' : 'Assessing'}: <span className="text-primary">{currentAssessment.showName}</span>
        {currentAssessment.showType && ` (${currentAssessment.showType})`}
      </h2>
      
      <div className="card bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border">
        {totalPages > 1 && (
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
              Page {currentPage} of {totalPages}
            </h3>
            <div className="text-sm text-gray-600 dark:text-dark-muted">
              Showing questions {startIndex + 1} - {endIndex} of {currentAssessment.questions.length}
            </div>
          </div>
        )}
        
        {currentQuestions.map((question) => (
          <div key={question.id} className={`question border-b border-gray-200 dark:border-dark-border pb-4 mb-4 ${hasAttemptedFinish && !question.answer ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
            <label htmlFor={`question-${question.id}`} className="block font-medium mb-3 text-gray-800 dark:text-dark-text">
              {question.text}
              <span className="ml-2 text-sm text-gray-600 dark:text-dark-muted">
                (Weight: {(question.weight * 100)}%)
              </span>
              {hasAttemptedFinish && !question.answer && (
                <span className="ml-2 text-sm text-red-600 dark:text-red-400">
                  (Required)
                </span>
              )}
            </label>
            <div className={`mt-3 ${ANSWER_OPTIONS_LAYOUT.horizontal ? 'sm:flex sm:flex-row sm:flex-wrap sm:gap-4' : 'flex flex-col'} gap-2`}>
              {ANSWER_OPTIONS.map(option => (
                <label 
                  key={option} 
                  className={`radio-label ${question.answer === option ? 'selected bg-primary/10 border-primary' : 'hover:bg-gray-50 dark:hover:bg-dark-card-hover'} ${ANSWER_OPTIONS_LAYOUT.horizontal ? 'sm:flex-1 sm:min-w-[120px]' : 'w-full'}`}
                  onClick={() => handleLabelClick(question.id, option)}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={question.answer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                  />
                  <span className="text-gray-700 dark:text-dark-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        {totalPages > 1 ? (
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={handlePrevious} 
              className="btn bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card-hover" 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="flex flex-col items-end">
              {!canProceed() && (
                <span className="text-sm text-red-600 dark:text-red-400 mb-2">
                  {getUnansweredCount()} question{getUnansweredCount() !== 1 ? 's' : ''} remaining
                </span>
              )}
              {currentPage < totalPages ? (
                <button 
                  onClick={handleNext} 
                  className={`btn ${canProceed() ? 'btn-primary' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                  disabled={!canProceed()}
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={handleNext} 
                  className={`btn ${canProceed() ? 'btn-primary' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                  disabled={!canProceed()}
                >
                  {onFinish ? 'Save Changes' : 'Finish'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end mt-8">
            {!canProceed() && (
              <span className="text-sm text-red-600 dark:text-red-400 mb-2">
                {getUnansweredCount()} question{getUnansweredCount() !== 1 ? 's' : ''} remaining
              </span>
            )}
            <button 
              onClick={handleNext} 
              className={`btn ${canProceed() ? 'btn-primary' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
              disabled={!canProceed()}
            >
              {onFinish ? 'Save Changes' : 'Finish'}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 card bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border">
        <p className="text-gray-600 dark:text-dark-muted mb-4">
          Please answer all questions before proceeding.
          Select "N/A" for any questions that don't apply to the content you're assessing.
        </p>
        
        <div className="p-4 bg-gray-50 dark:bg-glass-bg border border-gray-200 dark:border-glass-border rounded-xl">
          <p className="font-medium mb-3 text-gray-800 dark:text-dark-text">Keyboard Shortcuts:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-white dark:bg-glass-bg border border-gray-200 dark:border-glass-border rounded mr-2 text-gray-700 dark:text-dark-text">1</kbd>
              <span className="text-gray-700 dark:text-dark-text">for "N/A"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-white dark:bg-glass-bg border border-gray-200 dark:border-glass-border rounded mr-2 text-gray-700 dark:text-dark-text">2</kbd>
              <span className="text-gray-700 dark:text-dark-text">for "Disagree"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-white dark:bg-glass-bg border border-gray-200 dark:border-glass-border rounded mr-2 text-gray-700 dark:text-dark-text">3</kbd>
              <span className="text-gray-700 dark:text-dark-text">for "Agree"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-white dark:bg-glass-bg border border-gray-200 dark:border-glass-border rounded mr-2 text-gray-700 dark:text-dark-text">4</kbd>
              <span className="text-gray-700 dark:text-dark-text">for "Strongly Agree"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-white dark:bg-glass-bg border border-gray-200 dark:border-glass-border rounded mr-2 text-gray-700 dark:text-dark-text">Enter</kbd>
              <span className="text-gray-700 dark:text-dark-text">to save changes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
