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
    small: 'p-4 text-4xl',
    medium: 'p-6 text-6xl',
    large: 'p-8 text-6xl'
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
    } else {
      setShowDetails(true);
    }
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
            className={`mb-4 ${iconColor}`}
          />
          <span className="text-base text-gray-500">Weight: {question.weight}</span>
        </div>
        
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