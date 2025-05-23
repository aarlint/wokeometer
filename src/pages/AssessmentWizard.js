import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data';
import QuestionDetailsModal from '../components/QuestionDetailsModal';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AssessmentWizard = ({ currentAssessment, setCurrentAssessment, onFinish }) => {
  const [hasAttemptedFinish, setHasAttemptedFinish] = useState(false);
  const [noWokeContent, setNoWokeContent] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [botProtectionCheck, setBotProtectionCheck] = useState(false);
  const navigate = useNavigate();
  
  // New answer options with 4 detents
  const answerOptions = [
    { value: 'N/A', label: 'N/A', color: 'bg-gray-400' },
    { value: 'Disagree', label: 'Disagree', color: 'bg-green-500' },
    { value: 'Agree', label: 'Agree', color: 'bg-yellow-500' },
    { value: 'Strongly Agree', label: 'Strongly Agree', color: 'bg-red-500' }
  ];
  
  // Group questions by category
  const questionsByCategory = currentAssessment.questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  // Handle no woke content toggle
  const handleNoWokeContentChange = (checked) => {
    setNoWokeContent(checked);
    setBotProtectionCheck(false);
    
    if (checked) {
      // Gray out all questions when "No Woke Content" is selected
      const updatedQuestions = currentAssessment.questions.map(q => ({
        ...q,
        answer: 'N/A'
      }));
      
      setCurrentAssessment({
        ...currentAssessment,
        questions: updatedQuestions
      });
    }
  };

  // Handle answer change for individual questions
  const handleAnswerChange = (questionId, answer) => {
    if (noWokeContent && !botProtectionCheck) return; // Prevent changes when no woke content is selected without bot protection
    
    const updatedQuestions = currentAssessment.questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    );
    
    setCurrentAssessment({
      ...currentAssessment,
      questions: updatedQuestions
    });
  };

  // Handle finish assessment
  const handleFinish = () => {
    if (!canProceed()) {
      setHasAttemptedFinish(true);
      return;
    }
    
    if (onFinish) {
      onFinish();
    } else {
      navigate('/results');
    }
  };

  // Check if user can proceed
  const canProceed = () => {
    if (noWokeContent && !botProtectionCheck) {
      return false; // Require bot protection confirmation
    }
    
    if (noWokeContent && botProtectionCheck) {
      return true; // Allow proceeding with no woke content + bot protection
    }
    
    // Otherwise, require at least one question to be answered (not N/A)
    return currentAssessment.questions.some(q => 
      q.answer && q.answer !== "" && q.answer !== "N/A"
    );
  };

  // Get answer counts
  const getAnsweredCount = () => {
    return currentAssessment.questions.filter(q => 
      q.answer && q.answer !== "" && q.answer !== "N/A"
    ).length;
  };

  const getTotalQuestions = () => {
    return currentAssessment.questions.length;
  };

  // Slider component for each question
  const QuestionSlider = ({ question, disabled }) => {
    const currentAnswer = question.answer || 'N/A';
    const currentIndex = answerOptions.findIndex(option => option.value === currentAnswer);

    return (
      <div className={`p-6 rounded-lg border transition-all duration-200 ${
        disabled 
          ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-primary/50'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {question.text}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Weight: {question.weight}</span>
              <span>•</span>
              <span>{question.category}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedQuestionId(question.id)}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="More information"
          >
            <FaInfoCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Slider */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="3"
              value={currentIndex >= 0 ? currentIndex : 0}
              onChange={(e) => {
                if (!disabled) {
                  const newAnswer = answerOptions[parseInt(e.target.value)].value;
                  handleAnswerChange(question.id, newAnswer);
                }
              }}
              disabled={disabled}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                background: disabled ? undefined : `linear-gradient(to right, 
                  ${answerOptions[0].color} 0%, ${answerOptions[0].color} 25%, 
                  ${answerOptions[1].color} 25%, ${answerOptions[1].color} 50%, 
                  ${answerOptions[2].color} 50%, ${answerOptions[2].color} 75%, 
                  ${answerOptions[3].color} 75%, ${answerOptions[3].color} 100%)`
              }}
            />
          </div>
          
          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            {answerOptions.map((option, index) => (
              <span 
                key={option.value} 
                className={`font-medium ${
                  currentIndex === index ? 'text-gray-900 dark:text-gray-100' : ''
                }`}
              >
                {option.label}
              </span>
            ))}
          </div>
          
          {/* Current selection indicator */}
          <div className="text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentIndex >= 0 ? `${answerOptions[currentIndex].color} text-white` : 'bg-gray-200 text-gray-700'
            }`}>
              {currentIndex >= 0 ? answerOptions[currentIndex].label : 'No answer'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {onFinish ? 'Editing' : 'Assessment'}
        </h2>
        <p className="text-xl text-primary font-semibold">
          {currentAssessment.showName}
          {currentAssessment.showType && ` (${currentAssessment.showType})`}
        </p>
      </div>

      {/* No Woke Content Section - Positioned at top */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <FaCheckCircle className="text-2xl text-green-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No Woke Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Check this if the show/movie contains no woke elements whatsoever
              </p>
              
              {/* Bot Protection Checkbox */}
              {noWokeContent && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                        Please confirm you are not a bot by checking this box:
                      </p>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={botProtectionCheck}
                          onChange={(e) => setBotProtectionCheck(e.target.checked)}
                          className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                          I confirm this assessment was completed by a human
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={noWokeContent}
              onChange={(e) => handleNoWokeContentChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getAnsweredCount()} / {getTotalQuestions()} questions answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(getAnsweredCount() / getTotalQuestions()) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Assessment Questions by Category */}
      {CATEGORIES.map((category) => {
        const categoryQuestions = questionsByCategory[category] || [];
        if (categoryQuestions.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-primary pb-2">
              {category}
            </h3>
            <div className="space-y-4">
              {categoryQuestions.map((question) => (
                <QuestionSlider
                  key={question.id}
                  question={question}
                  disabled={noWokeContent && !botProtectionCheck}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Finish Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 text-center">
        {!canProceed() && hasAttemptedFinish && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-300 text-sm">
              {noWokeContent && !botProtectionCheck
                ? 'Please confirm you are not a bot to proceed'
                : 'Please answer at least one question to complete the assessment'
              }
            </p>
          </div>
        )}
        <button 
          onClick={handleFinish} 
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
            canProceed() 
              ? 'bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          disabled={!canProceed()}
        >
          {onFinish ? 'Save Changes' : 'Complete Assessment'}
        </button>
      </div>

      {/* Question Details Modal */}
      {selectedQuestionId && (
        <QuestionDetailsModal
          question={currentAssessment.questions.find(q => q.id === selectedQuestionId)}
          isOpen={!!selectedQuestionId}
          onClose={() => setSelectedQuestionId(null)}
        />
      )}
    </div>
  );
};

export default AssessmentWizard;
