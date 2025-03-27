import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANSWER_OPTIONS, ANSWER_OPTIONS_LAYOUT, CATEGORIES, calculateScore, getWokenessCategory, saveAssessment } from '../data';

const AssessmentWizard = ({ currentAssessment, setCurrentAssessment, onFinish }) => {
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [hasAttemptedFinish, setHasAttemptedFinish] = useState(false);
  const navigate = useNavigate();
  
  // Group questions by category
  const questionsByCategory = currentAssessment.questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});
  
  // Get current category's questions
  const currentQuestions = questionsByCategory[currentCategory] || [];
  
  // Update assessment when changing categories
  useEffect(() => {
    setCurrentAssessment({
      ...currentAssessment,
      currentCategory
    });
  }, [currentCategory]);

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
        // Enter key to proceed to next category or finish
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
    const currentIndex = CATEGORIES.indexOf(currentCategory);
    if (currentIndex < CATEGORIES.length - 1) {
      setCurrentCategory(CATEGORIES[currentIndex + 1]);
    } else {
      // If we're on the last category, check if we can proceed
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
    const currentIndex = CATEGORIES.indexOf(currentCategory);
    if (currentIndex > 0) {
      setCurrentCategory(CATEGORIES[currentIndex - 1]);
    }
  };
  
  const getAnsweredCount = () => {
    return currentAssessment.questions.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A").length;
  };

  const getUnansweredCount = () => {
    return currentAssessment.questions.filter(q => !q.answer || q.answer === "" || q.answer === "N/A").length;
  };

  const canProceed = () => {
    // Check if at least one question has been answered with a non-N/A value
    return currentAssessment.questions.some(q => q.answer && q.answer !== "" && q.answer !== "N/A");
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
      
      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setCurrentCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              currentCategory === category
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card-hover'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="card bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
            {currentCategory}
          </h3>
          <div className="text-sm text-gray-600 dark:text-dark-muted">
            Showing {currentQuestions.length} questions
          </div>
        </div>
        
        {currentQuestions.map((question) => (
          <div key={question.id} className={`question border-b border-gray-200 dark:border-dark-border pb-4 mb-4`}>
            <label htmlFor={`question-${question.id}`} className="block font-medium mb-3 text-gray-800 dark:text-dark-text">
              {question.text}
              <span className="ml-2 text-sm text-gray-600 dark:text-dark-muted">
                (Weight: {(question.weight * 100)}%)
              </span>
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
        
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={handlePrevious} 
            className="btn bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card-hover" 
            disabled={currentCategory === CATEGORIES[0]}
          >
            Previous Category
          </button>
          
          <div className="flex flex-col items-end">
            {!canProceed() && (
              <span className="text-sm text-red-600 dark:text-red-400 mb-2">
                Please answer at least one question to proceed
              </span>
            )}
            <div className="text-sm text-gray-600 dark:text-dark-muted mb-2">
              {getAnsweredCount()} answered, {getUnansweredCount()} unanswered
            </div>
            {currentCategory !== CATEGORIES[CATEGORIES.length - 1] ? (
              <button 
                onClick={handleNext} 
                className={`btn ${canProceed() ? 'btn-primary' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                disabled={!canProceed()}
              >
                Next Category
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
      </div>
      
      <div className="mt-6 card bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border">
        <p className="text-gray-600 dark:text-dark-muted mb-4">
          Answer the questions that apply to the content you're assessing.
          Questions left unanswered or marked as "N/A" will not be included in the final assessment.
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
              <span className="text-gray-700 dark:text-dark-text">to proceed to next category</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
