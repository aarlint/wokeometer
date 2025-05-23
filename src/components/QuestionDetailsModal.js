import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import StackedIcon from './StackedIcon';

const QuestionDetailsModal = ({ question, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !question) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 w-full h-full"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <div 
          className="bg-white dark:bg-dark-card rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative shadow-2xl"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-border">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  <StackedIcon 
                    icon={question.icon} 
                    isAnti={question.isAnti}
                    className={`text-[${question.color}]`}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                    {question.text}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-dark-muted">
                      Weight: {question.weight}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-dark-muted">
                      Category: {question.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-700 dark:text-dark-text" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-dark-text">
                  {question.description}
                </p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-2">
                  Examples
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-dark-text">
                  {question.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default QuestionDetailsModal; 