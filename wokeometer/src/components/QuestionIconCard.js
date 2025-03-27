import React, { useState } from 'react';
import StackedIcon from './StackedIcon';
import QuestionDetailsModal from './QuestionDetailsModal';

const QuestionIconCard = ({ 
  question, 
  onClick, 
  size = 'medium',
  showTooltip = true,
  interactive = true
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const sizeClasses = {
    small: 'p-2 text-2xl',
    medium: 'p-3 text-3xl',
    large: 'p-4 text-4xl'
  };

  const baseClasses = `relative group rounded-lg transition-all duration-200 ${
    interactive ? 'cursor-pointer' : ''
  }`;

  const stateClasses = question.answer === "Yes" 
    ? question.isAnti 
      ? 'bg-red-500/20 border-2 border-red-500' 
      : 'bg-primary/20 border-2 border-primary'
    : 'bg-transparent hover:bg-white/80 dark:hover:bg-dark-card/80 border border-gray-200 dark:border-dark-border';

  const iconColor = question.answer === "Yes" 
    ? question.isAnti 
      ? 'text-red-500' 
      : `text-[${question.color}]`
    : '';

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  return (
    <>
      <div
        className={`${baseClasses} ${stateClasses} ${sizeClasses[size]}`}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center">
          <StackedIcon 
            icon={question.icon} 
            isAnti={question.isAnti}
            className={`mb-1 ${iconColor}`}
          />
          <span className="text-xs text-gray-500">Weight: {question.weight}</span>
        </div>
        
        <button
          onClick={handleInfoClick}
          className="absolute bottom-1 right-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        {showTooltip && (
          <div className="absolute z-10 invisible group-hover:visible bg-gray-900/95 text-white text-sm rounded-lg py-2 px-3 -top-2 left-1/2 transform -translate-x-1/2 translate-y-[-100%] whitespace-nowrap shadow-lg max-w-xs">
            {question.text}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900/95"></div>
          </div>
        )}
      </div>

      <QuestionDetailsModal
        question={question}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default QuestionIconCard; 