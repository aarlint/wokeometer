import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANSWER_OPTIONS, ANSWER_OPTIONS_LAYOUT, CATEGORIES, calculateScore, getWokenessCategory, saveAssessment } from '../data';
import QuestionIconCard from '../components/QuestionIconCard';

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
      // Only process number keys 1-3
      if (e.key >= '1' && e.key <= '3') {
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
        handleFinish();
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
  
  const handleFinish = () => {
    if (!canProceed()) {
      setHasAttemptedFinish(true);
      return;
    }
    
    const score = calculateScore(currentAssessment.questions);
    const category = getWokenessCategory(score);
    
    if (onFinish) {
      onFinish();
    } else {
      navigate('/results');
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
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-dark-text">
        {onFinish ? 'Editing' : 'Assessing'}: <span className="text-primary">{currentAssessment.showName}</span>
        {currentAssessment.showType && ` (${currentAssessment.showType})`}
      </h2>
      
      <div className="card bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6">
        {CATEGORIES.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {questionsByCategory[category]?.map((question) => (
                <QuestionIconCard
                  key={question.id}
                  question={question}
                  onClick={() => handleAnswerChange(question.id, question.answer === "Yes" ? "" : "Yes")}
                  size="large"
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex flex-col items-center mt-8">
          {!canProceed() && (
            <span className="text-sm text-red-600 dark:text-red-400 mb-2">
              Please answer at least one question to proceed
            </span>
          )}
          <div className="text-sm text-gray-600 dark:text-dark-muted mb-4">
            {getAnsweredCount()} answered, {getUnansweredCount()} unanswered
          </div>
          <button 
            onClick={handleFinish} 
            className={`btn ${canProceed() ? 'btn-primary' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
            disabled={!canProceed()}
          >
            {onFinish ? 'Save Changes' : 'Finish Assessment'}
          </button>
        </div>
      </div>
      
      <div className="mt-6 card bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6">
        <p className="text-gray-600 dark:text-dark-muted mb-4">
          Click an icon to mark it as "Yes". Click again to unmark it.
          Questions left unmarked will not be included in the final assessment.
        </p>
      </div>
    </div>
  );
};

export default AssessmentWizard;
