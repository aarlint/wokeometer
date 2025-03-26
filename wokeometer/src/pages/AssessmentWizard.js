import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANSWER_OPTIONS } from '../data';

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
    return currentQuestions.every(q => q.answer !== "-- SELECT ONE --");
  };

  // Handle clicking on the entire label
  const handleLabelClick = (questionId, option) => {
    handleAnswerChange(questionId, option);
  };
  
  return (
    <div className="wizard-container">
      <h2 className="page-title text-2xl font-bold">
        Assessing: {currentAssessment.showName}
        {currentAssessment.showType && ` (${currentAssessment.showType})`}
      </h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </h3>
          <div className="text-sm text-gray-500">
            Showing questions {startIndex + 1} - {endIndex} of {currentAssessment.questions.length}
          </div>
        </div>
        
        {currentQuestions.map((question) => (
          <div key={question.id} className="question">
            <label htmlFor={`question-${question.id}`} className="block font-medium mb-2">
              {question.text}
            </label>
            <div className="flex flex-col gap-2 mt-2">
              {ANSWER_OPTIONS.map(option => (
                <label 
                  key={option} 
                  className={`radio-label ${question.answer === option ? 'selected' : ''}`}
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
        
        <div className="wizard-nav">
          <button 
            onClick={handlePrevious} 
            className="btn btn-secondary" 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="text-center">
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
      
      <div className="text-center text-sm text-gray-500">
        <p>Please answer all questions on this page before proceeding.</p>
        <p>Select "N/A" for any questions that don't apply to the content you're assessing.</p>
        
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="font-medium mb-2">Keyboard Shortcuts:</p>
          <ul className="grid grid-cols-2 gap-2">
            <li>Press <kbd className="px-2 py-1 bg-white border rounded">1</kbd> for "-- SELECT ONE --"</li>
            <li>Press <kbd className="px-2 py-1 bg-white border rounded">2</kbd> for "N/A"</li>
            <li>Press <kbd className="px-2 py-1 bg-white border rounded">3</kbd> for "Disagree"</li>
            <li>Press <kbd className="px-2 py-1 bg-white border rounded">4</kbd> for "Agree"</li>
            <li>Press <kbd className="px-2 py-1 bg-white border rounded">5</kbd> for "Strongly Agree"</li>
            <li>Press <kbd className="px-2 py-1 bg-white border rounded">Enter</kbd> to go to the next page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
