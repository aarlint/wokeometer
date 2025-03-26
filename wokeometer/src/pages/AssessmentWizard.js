import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANSWER_OPTIONS, ANSWER_OPTIONS_LAYOUT } from '../data';

const AssessmentWizard = ({ currentAssessment, setCurrentAssessment }) => {
  const [currentPage, setCurrentPage] = useState(currentAssessment.currentPage);
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
      // If we're on the last page, go to results
      navigate('/results');
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const canProceed = () => {
    // Check if all questions on the current page have been answered
    return currentQuestions.every(q => q.answer !== "");
  };

  // Handle clicking on the entire label
  const handleLabelClick = (questionId, option) => {
    handleAnswerChange(questionId, option);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Assessing: <span className="text-primary">{currentAssessment.showName}</span>
        {currentAssessment.showType && ` (${currentAssessment.showType})`}
      </h2>
      
      <div className="card">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </h3>
          <div className="text-sm text-dark-muted">
            Showing questions {startIndex + 1} - {endIndex} of {currentAssessment.questions.length}
          </div>
        </div>
        
        {currentQuestions.map((question) => (
          <div key={question.id} className="question">
            <label htmlFor={`question-${question.id}`} className="block font-medium mb-3">
              {question.text}
            </label>
            <div className={`mt-3 ${ANSWER_OPTIONS_LAYOUT.horizontal ? 'sm:flex sm:flex-row sm:flex-wrap sm:gap-4' : 'flex flex-col'} gap-2`}>
              {ANSWER_OPTIONS.map(option => (
                <label 
                  key={option} 
                  className={`radio-label ${question.answer === option ? 'selected' : ''} ${ANSWER_OPTIONS_LAYOUT.horizontal ? 'sm:flex-1 sm:min-w-[120px]' : 'w-full'}`}
                  onClick={() => handleLabelClick(question.id, option)}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={question.answer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={handlePrevious} 
            className="btn btn-secondary" 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div>
            {currentPage < totalPages ? (
              <button 
                onClick={handleNext} 
                className="btn btn-primary" 
                disabled={!canProceed()}
              >
                Next
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                className="btn btn-primary" 
                disabled={!canProceed()}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 card">
        <p className="text-dark-muted mb-4">
          Please answer all questions on this page before proceeding.
          Select "N/A" for any questions that don't apply to the content you're assessing.
        </p>
        
        <div className="p-4 neoglass">
          <p className="font-medium mb-3">Keyboard Shortcuts:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-glass-bg border border-glass-border rounded mr-2">1</kbd>
              <span>for "N/A"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-glass-bg border border-glass-border rounded mr-2">2</kbd>
              <span>for "Disagree"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-glass-bg border border-glass-border rounded mr-2">3</kbd>
              <span>for "Agree"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-glass-bg border border-glass-border rounded mr-2">4</kbd>
              <span>for "Strongly Agree"</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-1 bg-glass-bg border border-glass-border rounded mr-2">Enter</kbd>
              <span>to go to the next page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
